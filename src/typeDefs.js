import {gql} from 'apollo-server-express';

const typeDefs = gql`
  scalar Date
  scalar DateTime

  enum SortDirection {
    ascending
    descending
  }

  enum SortableRequestField {
    createdAt
  }

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

  enum RequestEnum {
    Pickup
    Delivery
    Stylist
    Outfit
    HelpMePack
    All
  }

  enum MaterialEnum {
    Cotton
    Wool
    Silk
    Denim
    Leather
    Fur
    Nylon
    Polyester
    Metal
    Plastic
    Suede
    Other
  }

  enum CategoryEnum {
    Cocktail
    Dinner
    Formal
    Work
    Social
    Casual
    Other
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

  type Outfit {
    _empty: String
  }

  type Meta {
    type: String
    note: String
  }

  type Request {
    _id: String
    numberOfItems: Int
    type: RequestEnum
    pickupLocation: Location
    items: [Item]
    user: User
    bookingId: String
    datetimePicked: DateTime
    contactPhoneNumber: String
    status: String
    metaData: Meta
    createdAt: DateTime
    updatedAt: DateTime
  }

  type RequestWithPaginationSortingFiltering {
    total: Int
    data: [Request!]!
  }

  type Booking {
    id: String
    state: String
    completed: Boolean
    what: String
    where: String
    description: String
    start: String
    email: String
  }

  type Closet {
    itemsIn: Int
    itemsOut: Int
    items: [Item!]!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Vault {
    _empty: String
  }

  type Item {
    _id: String
    name: String
    material: materialEnum
    category: categoryEnum
    type: String
    feature: String
    color: String
    brand: String
    stat: ItemStat
    matchingOutfit: Outfit
    createdAt: DateTime
    updatedAt: DateTime
  }

  type StripePayment {
    id: String
    email: String
    username: String
    amount: String
    created: String
    updated: String
    paymentType: String
    description: String
  }

  type StripePaymentList {
    perPage: Int
    end: String
    start: String
    hasNextPage: Boolean
    results: [StripePayment!]!
  }

  type StripeSubscription {
    id: String
  }

  type SubscriptionService {
    storage: Int
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
    stripePriceId: String
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
    requests: [Request]
    verified: Boolean
    token: String
    stripeCustomerId: String
    currentSubscriptionPlan: vcSubscription
    stripeSubscriptionId: String
    currentClosetSize: Int
    createdAt: DateTime
    updatedAt: DateTime
  }

  input SignupInput {
    email: String!
    phone: String
    password: String!
    location: String!
    zip: String!
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

  input addItemInput {
    _empty: String
  }

  input createRequest {
    """
    the date format - DD/MM/YYYY
    """
    date: String!
    """
    the time format(24hr) - HH:MM
    """
    time: String!
    """
    user might decide to add a new location or user currentLocation or one of the stored locations
    """
    pickupLocation: String
    """
    the type of the request range from pickup, delivery, stylist, outfit or helpmepack
    """
    type: RequestEnum
    """
    the number of items in the request if any
    """
    numberOfItems: Int
  }

  input updateRequestInput {
    _empty: String
  }

  input createSubscriptionInput {
    name: String!
    amount: String!
    type: SubEnum
    storage: Int
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
    """
    Fetch all subscriptions by type
    """
    fetchAllPaymentFromStripe(
      first: Int = 10
      start: String
      end: String
    ): StripePaymentList!
    """
    Fetch all user's request to include sorting and pagination
    """
    fetchAllRequest(
      type: RequestEnum = Pickup
      first: Int = 50
      start: Int = 0
      sort: SortDirection = descending
      sortBy: SortableRequestField = createdAt
    ): RequestWithPaginationSortingFiltering
    """
    Fetch one user's request
    """
    fetchOneRequest(id: ID!): Request!
    """
    Fetch booking for month and a day. NB you can either send the month or day
    """
    fetchBooking(
      """
      Send the month value boolean
      """
      month: Boolean = false
      """
      Send the index of the month value here (the date format - "2021-02-28T12:00:00Z")
      """
      day: String!
    ): [Booking!]!
    """
    Fetch one booking
    """
    fetchOneBooking(id: ID!): Booking!
    """
    Fetch one outfit
    """
    fetchOneOutfit(id: ID!): Outfit!
    """
    Fetch one item
    """
    fetchOneItem(id: ID!): Item!
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
    createSubscriptionMutation(input: createSubscriptionInput): vcSubscription!
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
    """
    upgrade a stripe subscription
    """
    upgradeSubscription(id: String, token: String): Message!
    """
    cancel a stripe subscription
    """
    cancelSubscription: Message!
    """
    create a request
    """
    createRequestMutation(input: createRequest): Request!
    """
    update a request
    """
    updateRequestMutation(
      id: ID!
      dataToBeUpdated: updateRequestInput
    ): Message!
    """
    delete a request
    """
    deleteRequest(id: ID): Message!
    """
    accept a pickup request (admin)
    """
    acceptPickupRequest(id: ID, bookingId: String): Message!
    """
    sendOut a pickup request (admin)
    """
    sendOutPickup(id: ID): Message!
    """
    confirm a pickup request (admin)
    """
    confirmPickup(id: ID): Message!
    """
    Add new item(s) to a user's closet
    """
    addItemToCloset(input: [addItemInput]): Message!
    """
    Create outfits from a user's closet item
    """
    createOutfit(items: [String], name: String): Message!
  }

  # type Subscription {
  #   newGreetings: Greetings
  # }
`;

export default typeDefs;
