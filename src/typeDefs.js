import {gql} from 'apollo-server-express';

const typeDefs = gql`
  scalar Date
  scalar DateTime

  enum SourceEnum {
    EMAIL
    GOOGLE
    FACEBOOK
  }

  enum GenderEnum {
    MALE
    FEMALE
  }

  enum UserEnum {
    REGULAR
    ADMIN
  }

  input SignupInput {
    email: String!
    phone: String
    password: String!
    location: String!
    zip: String!
  }

  type Message {
    message: String
  }

  type MessageWithToken {
    message: String
    token: String
  }

  type Location {
    location: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Report {
    _empty: String
  }

  type Pickup {
    _empty: String
  }

  type Request {
    _empty: String
  }

  type Closet {
    _empty: String
  }
  type Vault {
    _empty: String
  }

  type User {
    _id: ID!
    name: String
    email: String!
    password: String
    type: UserEnum!
    source: SourceEnum
    image: String
    phone: String
    gender: GenderEnum
    nationality: String
    resetPasswordExpires: String
    resetPasswordToken: String
    otpExpires: String
    otp: String
    locations: [Location]
    currentLocation: Location
    closet: Closet
    vault: Vault
    reports: [Report]
    pickups: [Pickup]
    requests: [Request]
    verified: Boolean
    token: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  input updateUserInput {
    password: String
    phone: String
    currentLocation: String
  }

  input updateUserPasswordInput {
    oldPassword: String!
    newPassword: String!
    confirmPassword: String!
  }

  type Query {
    """
    Query to get the authenticated user
    """
    me: User
    """
    Fetch user by id: should be accessible
    """
    userById(id: String): User!
    """
    Fetch users by ids: should be accessible
    """
    userByIds(ids: [String]): [User]!
    """
    Fetch users
    """
    users: [User]!
    """
    Fetch users by their type: should be accessible
    """
    usersByType(type: UserEnum): [User]!
  }

  type Mutation {
    """
    Mutation to create a user
    """
    register(input: SignupInput): MessageWithToken
    """
    Mutation to resend otp
    """
    resendOtp(email: String): Message
    """
    Mutation to verify user
    """
    verifyUser(email: String, otp: String): MessageWithToken
    """
    Mutation to resend verify user mail
    """
    resendVerifyUserMail(email: String): Message
    """
    Mutation to login a user
    """
    logIn(email: String!, password: String!): MessageWithToken!
    """
    Mutation to initiate a password reset request
    """
    requestResetPassword(email: String): MessageWithToken!
    """
    Mutation to reset password
    """
    resetPassword(
      resetToken: String!
      password: String
      confirmPassword: String
    ): Message!

    """
    Mutation to resend reset password email
    """
    resendResetPasswordRequestMail(
      email: String
      resetPasswordToken: String
    ): Message!
    """
    Mutation to login with google
    """
    googleAuth(accessToken: String!): String
    """
    Mutation to login with facebook
    """
    facebookAuth(accessToken: String!): String
    """
    Update the user profile
    """
    updateUserMutation(input: updateUserInput): User
    """
    Update the user's password
    """
    updateUserPassword(input: updateUserPasswordInput): Message!
    """
    add new Location to user
    """
    addLocation(location: String!): Message
    """
    update Location
    """
    updateLocation(id: String, newLocation: String): Message!
    """
    delete Location
    """
    deleteLocation(id: String): Message!
    """
    make Location current Location
    """
    makeLocationCurrent(id: String): Message!
  }

  # type Subscription {
  #   newGreetings: Greetings
  # }
`;

export default typeDefs;
