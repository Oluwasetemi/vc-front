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

  enum SubEnum {
    sub
    addon
    onDemand
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
    _id: ID
    location: String
    current: Boolean
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

  type StripeSubscription {
  #   id: String
  #   billing_cycle_anchor: 1610106475,
  #   cancel_at: null,
  #   cancel_at_period_end: false,
  #   canceled_at: null,
  #   collection_method: "charge_automatically",
  #   created: 1610106475,
  #   current_period_end: 1612784875,
  #   current_period_start: 1610106475,
  #   customer: "cus_IikxAfqeinhDF8",
  #   days_until_due: null,
  #   ended_at: null,

  # "items": {
  #   "object": "list",
  #   "data": [
  #     {
  #       "id": "si_IikxmEj7BpdEVd",
  #       "object": "subscription_item",
  #       "billing_thresholds": null,
  #       "created": 1610106476,
  #       "metadata": {},
  #       "price": {
  #         "id": "price_1I77Hm2eZvKYlo2CxJp2c9fT",
  #         "object": "price",
  #         "active": true,
  #         "billing_scheme": "per_unit",
  #         "created": 1610059734,
  #         "currency": "usd",
  #         "livemode": false,
  #         "lookup_key": null,
  #         "metadata": {},
  #         "nickname": null,
  #         "product": "prod_IiYOMSw8RB6oKP",
  #         "recurring": {
  #           "aggregate_usage": null,
  #           "interval": "month",
  #           "interval_count": 1,
  #           "usage_type": "licensed"
  #         },
  #         "tiers_mode": null,
  #         "transform_quantity": null,
  #         "type": "recurring",
  #         "unit_amount": 1600,
  #         "unit_amount_decimal": "1600"
  #       },
  #       "quantity": 1,
  #       "subscription": "sub_Iikxie8L1VWrKw",
  #       "tax_rates": []
  #     }
  #   ],
  #   "has_more": false,
  #   "url": "/v1/subscription_items?subscription=sub_Iikxie8L1VWrKw"
  # },
  # "livemode": false,
  # "start_date": 1610106475,
  # "status": "active",
  # "transfer_data": null,
  }

  type SubscriptionService {
    storage: String
    accessories: String
    shoes: String
    helpMePack: String
    stylist: String
    vault: String
    note: String
  }

  type vcSubscription {
    _id: String
    name: String
    amount: String
    services: SubscriptionService
    type: String
    stripeProductId: String
    createdAt: DateTime
    updatedAt: DateTime
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
    customerId: String
    currentSubscriptionPlan: vcSubscription
    stripeSubscriptionId: StripeSubscription
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

  input createSubscriptionInput {
    name: String!
    amount: String!
    type: SubEnum
    storage: String
    accessories: String
    shoes: String
    helpMePack: String
    stylist: String
    vault: String
    note: String
    stripeProductId: String
  }

  input updateSubscriptionInput {
    name: String
    amount: String
    storage: String
    accessories: String
    type: SubEnum
    shoes: String
    helpMePack: String
    stylist: String
    vault: String
    note: String
    stripeProductId: String
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
    """
    Fetch all subscriptions
    """
    fetchAllSubscription: [vcSubscription]!
    """
    Fetch all subscriptions by type
    """
    fetchAllSubscriptionByType(type: SubEnum): [vcSubscription]!
    """
    Fetch all subscriptions by type
    """
    fetchOneSubscription(id: String): vcSubscription!
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
    addLocation(location: String!): Location
    """
    update Location
    """
    updateLocation(id: String!, newLocation: String!): Location!
    """
    delete Location
    """
    deleteLocation(id: String): Message!
    """
    make Location current Location
    """
    makeLocationCurrent(id: String): Message!
    """
    create subscription/addon/onDemand plan
    """
    createSubscriptionMutation(input: createSubscriptionInput): Message!
    """
    update subscription/addon/onDemand plan
    """
    updateSubscriptionMutation(
      id: String
      dataToBeUpdated: updateSubscriptionInput
    ): Message!
    """
    delete subscription/addon/onDemand plan
    """
    deleteSubscription(id: String): Message!
    """
    create a stripe subscription
    """
    makePayment(id: String, token: String): Message!
  }

  # type Subscription {
  #   newGreetings: Greetings
  # }
`;

export default typeDefs;
