# This is the queries of the Backend

```graphql
mutation mutation_register_in498 {
  register(input: {email: "dev@virtual-closets.com", password: "123456", location: "house 4, califonia beach, location", zip: "12345", phone: "+2347036520266"}) {
    message
  }
}

mutation mutation_mutation_re320 {
  resendOtp(email: "setemi@mailinator.com") {
    message
  }
}

mutation mutation_mutation_re474 {
  verifyUser(email: "dev@virtual-closets.com", otp: "316615") {
    message
    token
  }
}

mutation mutation_mutation_re303 {
  logIn(email: "dev@virtual-closets.com", password: "123456") {
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
  resendResetPasswordRequestMail(email: "setemi@mailinator.com", resetPasswordToken: "04af8c1ce45a9bb781f0148eb7d1ba38f9cd704f") {
    message
  }
}

mutation mutation_mutation_re15 {
  resetPassword(resetToken: "ed5db642bd346ff59ca11a0a0a83e8df81e54fd9", password: "123456789", confirmPassword: "123456789") {
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
    closet {
      _id
      items {
        _id
        name
      }
    }
    outfit {
      _id
      name
      category
      createdAt
      updatedAt
      user {
        _id
        name
      }
    }
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
  updateUserMutation(input: {phone: "+2348051906829", currentLocation: "london again"}) {
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
  updateLocation(id: "5fdd0aafad2b277706cb8bed", newLocation: "cyer, new location 5") {
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
  createSubscriptionMutation(input: {name: "platinum", amount: "159.99", storage: 100, shoes: "15", accessories: "35", helpMePack: "4 per year", stylist: "1 personal stylist", vault: "10 items"}) {
    _id
  }
}

mutation mutation_mutation_re317 {
  createSubscriptionMutation(input: {name: "gold", amount: "99.99", storage: 50, shoes: "5", accessories: "10", helpMePack: "2 per year", stylist: "none", vault: "none"}) {
    _id
  }
}

mutation mutation_mutation_re318 {
  createSubscriptionMutation(input: {name: "silver", amount: "59.99", storage: 25, shoes: "none", accessories: "5", helpMePack: "1 per year", stylist: "none", vault: "none"}) {
    _id
  }
}

mutation mutation_mutation_re319 {
  createSubscriptionMutation(input: {name: "shoes only", amount: "3.99", storage: 0, shoes: "none", accessories: "none", helpMePack: "none", stylist: "none", vault: "none", note: "platinum and gold users only", type: addon}) {
    _id
  }
}

mutation mutation_mutation_re399 {
  createSubscriptionMutation(input: {name: "Accessories only", amount: "1", storage: 0, shoes: "none", accessories: "none", helpMePack: "none", stylist: "none", vault: "none", note: "ties, scarfs, purses", type: addon}) {
    _id
  }
}

mutation mutation_mutation_re398 {
  createSubscriptionMutation(input: {name: "help me pack onlyxxx", amount: "50", storage: 0, shoes: "none", accessories: "none", helpMePack: "none", stylist: "none", vault: "none", note: "for each occurrence ", type: onDemand}) {
    _id
    name
    amount
  }
}

mutation mutation_mutation_re691 {
  updateSubscriptionMutation(id: "5ff70cb1448be7578376177f", dataToBeUpdated: {note: "this is a silver subscription"}) {
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
  makePayment(id: "5ffe5799b67608a8beae133e", token: "tok_1IAGIxAj70kkGLpJf2i3174M") {
    _id
    name
  }
}

query mutation_mutation_re3301 {
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
  upgradeSubscription(id: "5ff70bec448be7578376177d", token: "tok_1I8nXwAj70kkGLpJn6oFcXBx") {
    message
  }
}

mutation mutation_mutation_re610 {
  createRequestMutation(input: {date: "12/02/2021", time: "12:00", type: Pickup, numberOfItems: 5}) {
    bookingId
    _id
  }
}

mutation mutation_mutation_re690 {
  acceptRequest(id: "60083dcfae225e2b84841456", bookingId: "2a9bd2a0-7119-4f4a-99ae-cef525fdf4c2") {
    _id
  }
}

mutation mutation_mutation_re800 {
  sendOutRequest(id: "60083dcfae225e2b84841456") {
    _id
  }
}

query mutation_mutation_re937 {
  fetchAllRequest(first: 2, sort: descending, type: All) {
    total
    data {
      _id
      numberOfItems
      type
      pickupLocation {
        _id
      }
      user {
        _id
        currentSubscriptionPlan {
          _id
        }
      }
      bookingId
      datetimePicked
      contactPhoneNumber
      status
      createdAt
      updatedAt
    }
  }
}

query mutation_mutation_re745 {
  fetchOneRequest(id: "60084b506383a03c8a2e773a") {
    _id
    numberOfItems
    type
    pickupLocation {
      _id
    }
    user {
      _id
      currentSubscriptionPlan {
        _id
      }
    }
    bookingId
    datetimePicked
    contactPhoneNumber
    status
    createdAt
    updatedAt
  }
}

query mutation_mutation_re777 {
  fetchOneBooking(id: "34c5310-78e4-4284-acde-9acf488e2b51") {
    id
    state
    completed
    what
    where
    description
    start
  }
}

query mutation_mutation_re426 {
  fetchBooking(day: "2021-02-28T12:00:00Z", month: true) {
    id
    state
    completed
    what
    where
    description
    start
    email
  }
}

mutation mutation_mutation_re928 {
  addItemToCloset(input: {items: [{name: "testItem", material: Cotton, category: Cocktail, type: "Shirt", feature: "Long Sleeve", color: "blue", brand: "LV", itemCondition: "Good", pickupId: "60083dcfae225e2b84841456"}, {name: "testItem", material: Cotton, category: Cocktail, type: "Shirt", feature: "Long Sleeve", color: "blue", brand: "LV", itemCondition: "Good", pickupId: "60083dcfae225e2b84841456"}, {name: "testItem", material: Cotton, category: Cocktail, type: "Shirt", feature: "Long Sleeve", color: "blue", brand: "LV", itemCondition: "Good", pickupId: "60083dcfae225e2b84841456"}], userId: "6002ff319c23052cf93d7b70"}) {
    message
  }
}

mutation mutation_mutation_re508 {
  createOutfit(items: ["600cdd3a16be467d34594056", "600ce2d31d25c77eb9117450"], name: "test outfit", description: "testing the create outfit mutation", userId: "6002ff319c23052cf93d7b70", tags: ["office", "coorperate"]) {
    message
  }
}

mutation mutation_mutation_re509 {
  createStylist(input: {name: "Stylist One", email: "stylist@mailinator.com", bio: "bio", tags: ["great", "good"], strength: ["culture", "strength"]}) {
    message
  }
}

mutation mutation_mutation_re93 {
  updateStylistMutation(id: "600ed98ac295530fb7e3eb1d", input: {name: "Stylist One", tags: ["bad", "notgood", "dance", "good", "great"], bio: "updated bio"}) {
    message
  }
}

query mutation_mutation_re202 {
  fetchOneOutfit(id: "600cfc7335602a8718b04181") {
    _id
    name
    description
    items {
      _id
      name
    }
    user {
      _id
      email
    }
    tags
    recommendations {
      type
      note
    }
    createdAt
    updatedAt
  }
}

query mutation_mutation_re699 {
  fetchOneStylist(id: "600ed98ac295530fb7e3eb1d") {
    _id
    name
    email
    bio
    image
    tags
    strength
    createdAt
    updatedAt
  }
}

query mutation_mutation_re133 {
  fetchOneItemMe(id: "600cdd3a16be467d34594056") {
    _id
    name
    material
    category
    type
    feature
    color
    brand
    stat {
      _empty
    }
    matchingOutfit {
      _id
      name
    }
    createdAt
    updatedAt
  }
}

query mutation_mutation_re888 {
  fetchClosetMe {
    itemsIn
    itemsOut
    items {
      _id
      name
      image
    }
    createdAt
    updatedAt
  }
}

query mutation_mutation_re526 {
  fetchAllItemMe {
    _id
    name
    material
    category
    type
    feature
    color
    brand
    stat {
      _empty
    }
    matchingOutfit {
      _id
      name
    }
    createdAt
    updatedAt
  }
}

query mutation_mutation_re3290 {
  fetchAllOutfit {
    total
    data {
      _id
      name
      description
      items {
        _id
        name
      }
      user {
        _id
        email
      }
      tags
      recommendations {
        type
        note
      }
      createdAt
      updatedAt
    }
  }
}

query mutation_mutation_re3299 {
  fetchAllOutfitMe {
    total
    data {
      _id
      name
      description
      items {
        _id
        name
      }
      user {
        _id
        email
      }
      tags
      recommendations {
        type
        note
      }
      createdAt
      updatedAt
    }
  }
}

query mutation_mutation_re32 {
  fetchAllOutfitUser(userId: "6002ff319c23052cf93d7b70") {
    total
    data {
      _id
      name
      description
      items {
        _id
        name
      }
      user {
        _id
        email
      }
      tags
      recommendations {
        type
        note
      }
      createdAt
      updatedAt
    }
  }
}

query mutation_mutation_re801 {
  fetchAllStylist {
    total
    data {
      _id
      name
      email
      bio
      image
      tags
      strength
      createdAt
      updatedAt
    }
  }
}

query mutation_mutation_re241 {
  userById(id: "6005971b982311f5bb7d1f79") {
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
    closet {
      _id
      itemsIn
      items {
        _id
        name
      }
    }
    outfit {
      _id
    }
  }
}

query mutation_mutation_re330 {
  userByIds(ids: ["5fd0b55f08471580717aaac3", "5fd010c92eab2f7c7ea266b0"]) {
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
    closet {
      _id
      itemsIn
      items {
        _id
        name
      }
    }
  }
}

query mutation_mutation_re14 {
  users {
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
    closet {
      _id
      itemsIn
      items {
        _id
        name
      }
    }
  }
}

query mutation_mutation_re765 {
  usersByType(type: ADMIN) {
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
    closet {
      _id
      itemsIn
      items {
        _id
        name
      }
    }
  }
}

query mutation_mutation_re385 {
  fetchDashboard {
    request
    delivery
    pickup
    laundry
    stylistRequest
    closet
    vault
  }
}

mutation mutation_mutation_re678 {
  updateUserOutfitMutation(id: "600efb22a2a538af358bc966", dataToBeUpdated: {items: ["600ef9f2a2a538af358bc964", "600ef9f2a2a538af358bc965"], name: "updated outfit", description: "updated outfit", tags: ["office", "updated items", "again tags"], category: Work}) {
    _id
    name
  }
}

mutation mutation_mutation_re417 {
  likeAnOutfit(id: "600ef9f2a2a538af358bc964") {
    _id
  }
}

mutation mutation_mutation_re730 {
  unlikeAnOutfit(id: "600ef9f2a2a538af358bc965") {
    _id
  }
}

mutation mutation_mutation_re36 {
  updateOneItemNameMe(id: "600ce2d31d25c77eb9117450", name: "TestItem updated 2") {
    _id
    name
    material
    category
    type
    feature
    color
    brand
    image
    largeImage
    createdAt
    updatedAt
  }
}

query mutation_mutation_re881 {
  fetchOneItemUser(id: "600cdd3a16be467d34594056", userId: "6002ff319c23052cf93d7b70") {
    _id
    name
    material
    category
    type
    feature
    color
    brand
    image
    largeImage
    stat {
      _empty
    }
    createdAt
    updatedAt
  }
}

query mutation_mutation_re823 {
  fetchUserCloset(userId: "6002ff319c23052cf93d7b70") {
    _id
    itemsIn
    itemsOut
    items {
      _id
      name
      material
      category
      type
      feature
      color
      brand
      image
      largeImage
      pickup {
        datetimePicked
      }
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}

query mutation_mutation_re147 {
  fetchAllItemUser(userId: "6002ff319c23052cf93d7b70") {
    _id
    name
    material
    category
    type
    feature
    color
    brand
    image
    largeImage
    stat {
      _empty
    }
    createdAt
    updatedAt
  }
}


```
