# This is the changelog of the Backend

## v0.1.0

- 3db268 Complete the Auth Module `register, LogIn, resendOtp, verifyUser, requestResetPassword, resendResetPasswordRequestMail, resetPassword` mutation.

## v0.1.1 Bug Fix

- 3db268 Fix the changes on Auth Module `verifyUser` - it now returns token to authenticate a current user. `requestResetPassword` now return the `resetPasswordToken` as a token. Create a new mutation `resendVerifyUserMail` to handle changes when the use loses the otp or account verification mail.
