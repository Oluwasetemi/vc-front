# This is the queris of the Backend

```graphql
mutation mutation_register_in498 {
  register(input: {email: "setemi2@mailinator.com", password: "123456", location: "xyz, location", zip: "12345", phone: "+2347036520266"}) {
    message
  }
}

mutation mutation_mutation_re320 {
  resendOtp(email: "setemi@mailinator.com") {
    message
  }
}

mutation mutation_mutation_re474 {
  verifyUser(email: "setemi@mailinator.com", otp: "963579") {
    message
    token
  }
}

mutation mutation_mutation_re303 {
  logIn(email: "setemi@mailinator.com", password: "123456") {
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
  }
}

mutation mutation_mutation_re403 {
  addLocation(location: "22, location, Houston 2") {
    message
  }
}

mutation mutation_mutation_re507 {
  updateUserMutation(input: {phone: "+2348051906829", currentLocation: "london"}) {
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
  updateLocation(id: "5fdd27841ea2a87ab8bc637e", newLocation: "cyer, new location 2") {
    message
  }
}

mutation mutation_mutation_re418 {
  deleteLocation(id: "5fdd8ab9ef048780194229b0") {
    message
  }
}

mutation mutation_mutation_re396 {
  makeLocationCurrent(id: "5fdd268710fa0d79779c584f") {
    message
  }
}
```
