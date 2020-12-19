# This is the changelog of the Backend

## v0.1.0

- 3db268 Complete the Auth Module `register, LogIn, resendOtp, verifyUser, requestResetPassword, resendResetPasswordRequestMail, resetPassword` mutation.

## v0.1.1 Bug Fix

- de49bfe Fix the changes on Auth Module `verifyUser` - it now returns token to authenticate a current user. `requestResetPassword` now return the `resetPasswordToken` as a token. Create a new mutation `resendVerifyUserMail` to handle changes when the use loses the otp or account verification mail.

## v0.1.2 Accounts and Locations

- 819726a Fix the Accounts and Location, Fix a bug while registering account.New mutations include `updateUserMutation`, `updateUserPassword`, `addLocation`, `updateLocation`, `deleteLocation`, `makeLocationCurrent`. New queries include `me`, `userById`, `userByIds`,`users`, `usersByType`.

## v0.1.3 Bug and Modifications

- bfde159 - 🐛 FIX: allow location and currentLocation to populate to Location object
- 125de06 Allow `updateUserMutation` to support currentLocation update
