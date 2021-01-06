/* eslint-disable no-shadow */
import {
  createLocation,
  findOneLocationBasedOnQuery,
  removeLocation,
  updateLocation,
} from '../../services/location';
import {updateUser} from '../../services/user';
import {hash, match} from '../../utils/auth';
import {clean} from '../../utils/helpers';

const UserMutation = {
  async updateUserMutation(parent, {input}, {user}) {
    try {
      // check whether the user is logged in
      if (!user || user === null) {
        throw new Error('You must be logged In');
      }

      // check if the user is activated and not suspended
      if (user && user.verified === false) {
        throw new Error('Account is not activated');
      }

      let newHashedPassword;
      if (input.password) {
        // hash new password
        newHashedPassword = await hash(input.password);
        input.password = newHashedPassword;
      }

      if (input.currentLocation) {
        // update location
        await updateLocation(
          {_id: user.currentLocation},
          {location: input.currentLocation, current: true},
        );
      }

      delete input.currentLocation;

      const updateData = {...input};

      // remove null fields
      clean(updateData);

      // validate data
      const updatedUser = await updateUser({_id: user._id}, updateData);
      delete updatedUser.password;
      delete updatedUser._doc.password;

      return updatedUser;
    } catch (error) {
      console.log(error.message);
      throw new Error('Server Error');
    }
  },
  async updateUserPassword(parent, {input}, {user}) {
    try {
      // check whether the user is logged in
      if (!user || user === null) {
        throw new Error('You must be logged In');
      }

      // check if the user is activated and not suspended
      if (user && user.verified === false) {
        throw new Error('Account is not activated');
      }

      const {oldPassword, newPassword, confirmPassword} = input;
      // validate data
      // confirm  old_password match
      const matched = await match(oldPassword, user.password);

      if (!matched) {
        throw new Error('Incorrect password');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Password do not match');
      }
      // confirm the new_password and confirm_password
      if (matched && newPassword === confirmPassword) {
        // hash new password
        const newHashedPassword = await hash(newPassword);
        const updatedUser = await updateUser(
          {_id: user._id},
          {password: newHashedPassword},
        );

        if (!updatedUser) {
          throw new Error('Error while updating');
        }

        return {message: 'Password update successful'};
      }
    } catch (error) {
      // console.log(error.message);
      throw new Error('Server Error');
    }
  },
  async addLocation(_, {location}, {user}) {
    try {
      // check whether the user is logged in
      if (!user || user === null) {
        throw new Error('You must be logged In');
      }

      // check if the user is activated and not suspended
      if (user && user.verified === false) {
        throw new Error('Account is not activated');
      }

      // create location
      const createdLocation = await createLocation({location});

      // update user data
      await updateUser(
        {_id: user._id},
        {$push: {locations: createdLocation._id}},
      );

      return createdLocation;
    } catch (error) {
      console.log(error.message);
      throw new Error('Server Error');
    }
  },
  async updateLocation(_, {id, newLocation}, {user}) {
    // check whether the user is logged in
    if (!user || user === null) {
      throw new Error('You must be logged In');
    }

    // check if the user is activated and not suspended
    if (user && user.verified === false) {
      throw new Error('Account is not activated');
    }

    if (!id || !newLocation) {
      throw new Error('Server error');
    }

    // update Location
    const updatedLocation = await updateLocation(
      {_id: id},
      {location: newLocation},
    );

    return updatedLocation;
  },
  async deleteLocation(_, {id}, {user}) {
    // check whether the user is logged in
    if (!user || user === null) {
      throw new Error('You must be logged In');
    }

    // check if the user is activated and not suspended
    if (user && user.verified === false) {
      throw new Error('Account is not activated');
    }

    const removedLocation = await removeLocation(id);

    if (!removeLocation) {
      throw new Error('no location found');
    }

    // remove from user
    await updateUser(
      {_id: user._id},
      {$pull: {locations: removedLocation._id}},
    );

    return {message: 'Location removed successfully'};
  },
  async makeLocationCurrent(_, {id}, {user}) {
    // check whether the user is logged in
    if (!user || user === null) {
      throw new Error('You must be logged In');
    }

    // check if the user is activated and not suspended
    if (user && user.verified === false) {
      throw new Error('Account is not activated');
    }

    // set the current location to false
    await updateLocation({_id: user.currentLocation}, {current: false});

    // check if id is a real location
    const location = await findOneLocationBasedOnQuery({_id: id});

    if (!location) {
      throw new Error('Invalid location ID');
    }

    if (location.current !== true) {
      location.current = true;
    }

    await location.save();

    // update user data
    await updateUser({_id: user._id}, {currentLocation: location._id});

    return {message: 'Location set as current Location'};
  },
};

export default UserMutation;
