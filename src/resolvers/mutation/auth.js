/* eslint-disable no-shadow */
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server-express';
import axios from 'axios';
import {randomBytes} from 'crypto';
import {promisify} from 'util';
import validator from 'validator';
import {send} from '../../mail/mail';
import {createLocation} from '../../services/location';
import {
  createUser,
  findOneBasedOnQuery,
  findOneByEmail,
  updateUser,
} from '../../services/user';
import {hash, match, sign} from '../../utils/auth';
import client from '../../utils/twilio';

const AuthMutation = {
  async register(_, {input}) {
    try {
      // loop thru all values of input and trim the white spaces
      for (const each in input) {
        if (each in input) {
          if (typeof input[each] === 'string') {
            input[each] = input[each].trim();
          }
        }
      }
      // validate the input that graphql will not validate
      const isEmail = validator.isEmail(input.email);

      if (!isEmail) {
        throw new Error('The email input is not a valid email');
      }

      // check if user(company) exist on the platform before
      const userExists = await findOneByEmail(input.email);

      if (userExists) {
        throw new Error('Email taken, Please try another email');
      }

      // create user
      const password = await hash(input.password);

      // set otp
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes from now

      // create location if location
      let location;
      if (input.location) {
        location = await createLocation({
          location: input.location,
          current: true,
        });
      }

      const user = await createUser({
        email: input.email,
        name: input.email.split('@')[0],
        phone: input.phone ? input.phone : null,
        password,
        otp,
        otpExpires,
        currentLocation: location ? location._id : null,
        locations: location ? [location._id] : [],
        zip: input.zip ? input.zip : null,
      });

      if (!user) {
        throw new Error('User creation was not successful');
      }

      // generate token
      const token = await sign(user._id);

      if (!token) {
        throw new Error('Token generation error');
      }

      // send email to the new user
      await send({
        filename: 'new_user_welcome',
        to: user.email,
        subject: 'Welcome to Virtual Closet',
        email: user.email,
        otp,
      });

      // send sms
      await client.messages.create({
        body: `Here is your virtual closet otp, ${otp}. It expires in 5 minutes. Virtual Closet team`,
        from: process.env.TWILIO_TEST_PHONE_NUMBER,
        to: `${user.phone}`,
      });

      // const result = { ...user._doc, password: null };
      const result = {
        message: 'Your registered successfully. Confirm your account with OTP',
        token,
      };

      // console.log(args);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async resendOtp(_, {email}) {
    try {
      const user = await findOneBasedOnQuery({
        email,
        otpExpires: {$gt: Date.now()},
      });

      if (!user) {
        // generate another otp
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes from now

        const res = await updateUser({email}, {otp, otpExpires});
        // send email to the new user
        await send({
          filename: 'resend_otp',
          to: res.email,
          subject: 'Resend Otp',
          email: res.email,
          otp,
        });

        // send sms
        await client.messages.create({
          body: `Here is your resent virtual closet otp, ${otp}. It expires in 5 minutes. Virtual Closet team`,
          from: process.env.TWILIO_TEST_PHONE_NUMBER,
          to: `${res.phone}`,
        });

        return {message: 'Otp resent successfully'};
      }

      // send email to the new user
      await send({
        filename: 'resend_otp',
        to: user.email,
        subject: 'Resend Otp',
        email: user.email,
        otp: user.otp,
      });

      // send sms
      await client.messages.create({
        body: `Here is your virtual closet otp, ${user.otp}. It expires in 5 minutes. Virtual Closet team`,
        from: process.env.TWILIO_TEST_PHONE_NUMBER,
        to: `${user.phone}`,
      });

      return {message: 'Otp resent successfully'};
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async verifyUser(_, {otp, email}) {
    try {
      const user = await findOneBasedOnQuery({
        email,
        otp,
        otpExpires: {$gt: Date.now()},
      });

      if (!user) {
        throw new Error('Otp has Expired');
      }

      const res = await updateUser(
        {email},
        {otp: null, otpExpires: null, verified: true},
      );

      // generate token
      const token = await sign(res._id);

      if (!token) {
        throw new Error('Token generation error');
      }

      // send email to the new user
      await send({
        filename: 'user_verified',
        to: res.email,
        subject: 'Account Verified',
        email: res.email,
      });

      return {message: 'Account Verified', token};
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async resendVerifyUserMail(_, {email}) {
    try {
      const user = await findOneBasedOnQuery({
        email,
      });

      if (!user) {
        throw new Error(`No such user found for email ${email}`);
      }

      if (user.verified === true) {
        return {message: 'User verified already'};
      }

      // generate another otp
      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes from now

      const res = await updateUser({email}, {otp, otpExpires});
      // send email to the new user
      await send({
        filename: 'resend_otp',
        to: res.email,
        subject: 'Resend Otp',
        email: res.email,
        otp,
      });

      // send sms
      await client.messages.create({
        body: `Here is your virtual closet otp, ${otp}. It expires in 5 minutes. Virtual Closet team`,
        from: process.env.TWILIO_TEST_PHONE_NUMBER,
        to: `${res.phone}`,
      });

      return {message: 'OTP resent, Confirm your account with OTP!'};
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async logIn(_, {email, password}) {
    try {
      const userExist = await findOneBasedOnQuery({
        email: email.toLowerCase(),
      });

      if (!userExist) {
        throw new AuthenticationError(`User does not exist`);
      }

      if (!userExist.password && (userExist.googleId || userExist.facebookId)) {
        return new UserInputError(
          'This account was created using social media login. Please use one of the buttons above and optionally set a password in your account settings after you log in.',
        );
      }

      // check password
      const matched = await match(password, userExist.password);

      if (!matched) {
        throw new AuthenticationError('Invalid email/password combination');
      }

      if (!userExist.verified) {
        return new ForbiddenError(
          'This account is not activated. Check your email for an activation link, or send a new one. The email may end up in your spam folder.',
        );
      }

      // generate token
      const token = await sign(userExist._id);

      if (!token) {
        throw new Error('Token generation error');
      }

      // await updateUser(
      //   {_id: userExist._id},
      //   {totalRewardPoints: userExist.totalRewardPoints + 5},
      // );

      const result = {message: 'Logged in successfully', token};

      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async requestResetPassword(parent, {email}) {
    try {
      // 1. check if this is a real user
      const user = await findOneByEmail(email);

      if (!user) {
        throw new AuthenticationError(`No such user found for email ${email}`);
      }
      // 2. set a reset token and expiry on that user
      const randomBytesPromisified = promisify(randomBytes);
      const resetPasswordToken = (await randomBytesPromisified(20)).toString(
        'hex',
      );
      const resetPasswordExpires = Date.now() + 3600000; // 1 hr from now
      const res = await updateUser(
        {email},
        {resetPasswordExpires, resetPasswordToken},
      );

      await send({
        filename: 'request_reset',
        to: user.email,
        subject: 'Your Password Reset Token',
        email: user.email,
        resetLink: `${process.env.FRONTEND_MOBILE_URL}auth/reset?resetPasswordToken=${resetPasswordToken}`,
      });

      return {
        message: 'Thanks. Request for Password Reset successful',
        token: resetPasswordToken,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async resendResetPasswordRequestMail(_, {email, resetPasswordToken}) {
    try {
      const user = await findOneBasedOnQuery({
        email,
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpires: {$gt: Date.now()},
      });

      if (!user) {
        throw new Error(`No such user found for email ${email}`);
      }

      // resend email
      await send({
        filename: 'request_reset',
        to: user.email,
        subject: 'Your Password Reset Token Resent',
        email: user.email,
        resetLink: `${process.env.FRONTEND_MOBILE_URL}auth/reset?resetPasswordToken=${resetPasswordToken}`,
      });

      return {message: 'Check your email to complete the password reset'};
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async resetPassword(parent, {resetPasswordToken, password, confirmPassword}) {
    try {
      // 1.check if the passwords match
      if (password !== confirmPassword) {
        throw new Error('password does not match');
      }

      // 2. check if its a legit reset Token
      // 3. check if its expired
      const user = await findOneBasedOnQuery({
        resetPasswordToken,
        resetPasswordExpires: {$gt: Date.now()},
      });

      if (!user) {
        throw new Error('This token is either invalid or expired');
      }

      // 4. Hash their new password
      const hashedPassword = await hash(password);

      // 5. Save the new password to the user and remove old resetToken fields
      const updatedUser = await updateUser(
        {email: user.email},
        {
          resetPasswordToken: null,
          resetPasswordExpires: null,
          password: hashedPassword,
          verified: true,
        },
      );
      // 6. Generate JWT
      const token = await sign(updatedUser.id);

      // 7. send mail notification
      await send({
        filename: 'reset_successful',
        to: user.email,
        subject: 'Password Reset Successful',
        email: user.email,
      });

      // 8. return the new user
      return {message: 'Reset Password Completed Successfully', token};
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async googleAuth(_, {accessToken}) {
    const response = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {params: {access_token: accessToken}},
    );

    const {name, email, sub: googleId} = response.data;

    let user;
    user = await findOneBasedOnQuery({
      email,
      googleId,
      source: 'GOOGLE',
    });

    if (user) {
      // if (user.type !== 'INDIVIDUAL') {
      //   throw new Error(
      //     'User with this google account exist with another type.',
      //   );
      // }

      const token = await sign(user._id);

      user = JSON.parse(JSON.stringify(user));
      delete user.password;

      return {message: 'User logged in successfully', token};
    }

    user = await createUser({
      email,
      source: 'GOOGLE',
      googleId,
      verified: true,
      password: googleId,
    });

    const token = await sign(user._id);

    return {message: 'User logged in successfully', token};
  },
  async facebookAuth(parent, {accessToken}) {
    const response = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields: ['id', 'email', 'name'].join(','),
        access_token: accessToken,
      },
    });

    const {id: facebookId, email, name} = response.data;

    let user;
    user = await findOneBasedOnQuery({
      email,
      facebookId,
      source: 'FACEBOOK',
    });

    if (user) {
      // if (user.type !== 'INDIVIDUAL') {
      //   throw new Error(
      //     'User with this google account exist with another type.',
      //   );
      // }

      const token = await sign(user._id);

      user = JSON.parse(JSON.stringify(user));
      delete user.password;

      return {message: 'User logged in successfully', token};
    }

    user = await createUser({
      email,
      source: 'FACEBOOK',
      facebookId,
      verified: true,
      password: facebookId,
    });

    const token = await sign(user._id);

    return {message: 'User logged in successfully', token};
  },
};

export default AuthMutation;
