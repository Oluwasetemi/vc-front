# This is the queries of the Backend

```graphql
mutation mutation_register_in498 {
  register(
    input: {
      email: "setemi4@mailinator.com"
      password: "123456"
      location: "house 4, califonia beach, location"
      zip: "12345"
      phone: "+2347036520266"
    }
  ) {
    message
  }
}

mutation mutation_mutation_re320 {
  resendOtp(email: "setemi@mailinator.com") {
    message
  }
}

mutation mutation_mutation_re474 {
  verifyUser(email: "setemi4@mailinator.com", otp: "712556") {
    message
    token
  }
}

mutation mutation_mutation_re303 {
  logIn(email: "virtual-closet@mailinator.com", password: "123456") {
    message
    token
  }
}

mutation mutation_mutation_re254 {
  requestResetPassword(email: "setemi@mailinator.com") {
    message
  }
}

mutation mutation_mutation_re832 {
  resendResetPasswordRequestMail(
    email: "setemi@mailinator.com"
    resetPasswordToken: "04af8c1ce45a9bb781f0148eb7d1ba38f9cd704f"
  ) {
    message
  }
}

mutation mutation_mutation_re15 {
  resetPassword(
    resetToken: "ed5db642bd346ff59ca11a0a0a83e8df81e54fd9"
    password: "123456789"
    confirmPassword: "123456789"
  ) {
    message
  }
}

mutation mutation_mutation_re475 {
  resendVerifyUserMail(email: "setemi4@mailinator.com") {
    message
  }
}

query mutation_mutation_re679 {
  me {
    _id
    name
    email
    password
    type
    phone
    source
    image
    gender
    nationality
    resetPasswordExpires
    resetPasswordToken
    otpExpires
    otp
    verified
    token
    locations {
      _id
      location
      current
      createdAt
    }
    currentLocation {
      _id
      location
      createdAt
      current
    }
    currentSubscriptionPlan {
      _id
      name
      amount
      stripeProductId
      stripePriceId
    }
    stripeSubscriptionId
  }
}

mutation mutation_mutation_re403 {
  addLocation(location: "22, location, Houston 2") {
    _id
    location
    current
    createdAt
    updatedAt
  }
}

mutation mutation_mutation_re507 {
  updateUserMutation(
    input: {phone: "+2348051906829", currentLocation: "london again"}
  ) {
    _id
    name
    email
    password
    type
    source
    image
    gender
    nationality
    resetPasswordExpires
    resetPasswordToken
    otpExpires
    otp
    verified
    token
    createdAt
    updatedAt
  }
}

mutation mutation_mutation_re480 {
  updateLocation(
    id: "5fdd0aafad2b277706cb8bed"
    newLocation: "cyer, new location 5"
  ) {
    _id
    location
    current
    createdAt
    updatedAt
  }
}

mutation mutation_mutation_re418 {
  deleteLocation(id: "5fdd8ab9ef048780194229b0") {
    message
  }
}

mutation mutation_mutation_re396 {
  makeLocationCurrent(id: "5fdd0aafad2b277706cb8bed") {
    message
  }
}

mutation mutation_mutation_re316 {
  createSubscriptionMutation(
    input: {
      name: "platinum"
      amount: "159.99"
      storage: "100 clothing Items"
      shoes: "15"
      accessories: "35"
      helpMePack: "4 per year"
      stylist: "1 personal stylist"
      vault: "10 items"
    }
  ) {
    message
  }
}

mutation mutation_mutation_re317 {
  createSubscriptionMutation(
    input: {
      name: "gold"
      amount: "99.99"
      storage: "50 clothing Items"
      shoes: "5"
      accessories: "10"
      helpMePack: "2 per year"
      stylist: "none"
      vault: "none"
    }
  ) {
    message
  }
}

mutation mutation_mutation_re318 {
  createSubscriptionMutation(
    input: {
      name: "silver"
      amount: "59.99"
      storage: "25 clothing Items"
      shoes: "none"
      accessories: "5"
      helpMePack: "1 per year"
      stylist: "none"
      vault: "none"
    }
  ) {
    message
  }
}

mutation mutation_mutation_re319 {
  createSubscriptionMutation(
    input: {
      name: "shoes only"
      amount: "3.99"
      storage: "none"
      shoes: "none"
      accessories: "none"
      helpMePack: "none"
      stylist: "none"
      vault: "none"
      note: "platinum and gold users only"
      type: addon
    }
  ) {
    message
  }
}

mutation mutation_mutation_re399 {
  createSubscriptionMutation(
    input: {
      name: "Accessories only"
      amount: "1"
      storage: "none"
      shoes: "none"
      accessories: "none"
      helpMePack: "none"
      stylist: "none"
      vault: "none"
      note: "ties, scarfs, purses"
      type: addon
    }
  ) {
    message
  }
}

mutation mutation_mutation_re398 {
  createSubscriptionMutation(
    input: {
      name: "help me pack onlyxxx"
      amount: "50"
      storage: "none"
      shoes: "none"
      accessories: "none"
      helpMePack: "none"
      stylist: "none"
      vault: "none"
      note: "for each occurrence "
      type: onDemand
    }
  ) {
    message
  }
}

mutation mutation_mutation_re691 {
  updateSubscriptionMutation(
    id: "5ff70cb1448be7578376177f"
    dataToBeUpdated: {note: "this is a silver subscription"}
  ) {
    message
  }
}

mutation mutation_mutation_re219 {
  deleteSubscription(id: "5ff714ddb85a3e5a88aa46be") {
    message
  }
}

query mutation_mutation_re967 {
  fetchAllSubscription {
    name
    amount
    services {
      storage
      accessories
      shoes
      helpMePack
      stylist
      vault
      note
    }
    type
    createdAt
    updatedAt
  }
}

query mutation_mutation_re668 {
  fetchAllSubscriptionByType(type: sub) {
    _id
    name
    amount
    services {
      storage
      accessories
      shoes
      helpMePack
      stylist
      vault
      note
    }
    type
    createdAt
    updatedAt
  }
}

query mutation_mutation_re953 {
  fetchOneSubscription(id: "5ff70bec448be7578376177d") {
    _id
    name
    amount
    services {
      storage
      accessories
      shoes
      helpMePack
      stylist
      vault
      note
    }
    type
    createdAt
    updatedAt
  }
}

mutation mutation_mutation_re570 {
  makePayment(
    id: "5ffe5799b67608a8beae133e"
    token: "tok_1I8zhpAj70kkGLpJElOh9ljj"
  ) {
    message
  }
}

query mutation_mutation_re330 {
  users {
    _id
    name
    email
    password
    type
    source
    image
    phone
    gender
    nationality
    resetPasswordExpires
    resetPasswordToken
    otpExpires
    otp
    verified
    token
    stripeCustomerId
    createdAt
    updatedAt
  }
}

query mutation_mutation_re996 {
  fetchAllPaymentFromStripe(first: 10) {
    perPage
    end
    start
    hasNextPage
    results {
      id
      email
      username
      amount
      created
      updated
      paymentType
      description
    }
  }
}

mutation mutation_mutation_re875 {
  cancelSubscription {
    message
  }
}

mutation mutation_mutation_re138 {
  upgradeSubscription(
    id: "5ff70bec448be7578376177d"
    token: "tok_1I8nXwAj70kkGLpJn6oFcXBx"
  ) {
    message
  }
}
```
