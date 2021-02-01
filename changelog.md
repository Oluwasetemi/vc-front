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
- 4e102c7 - 🐛 FIX: bug fix on updateUserMutation

## v0.1.4 Subscriptions and Payment

- b06286d 📦 NEW: finish the payment and subscriptions

## v0.1.5 Bug fix and new queries and mutation

- main 1fc5956 📦 NEW: v0.1.5 Bug fix and new queries and mutation. New Queries to `fetchAllPaymentFromStripe` with pagination support, update `me` to support `currentSubscriptionPlan` and `stripeSubscriptionId` fields, mutation to `cancelSubscription` and work in progress `upgradeSubscription`

## v0.1.6 First Version of the request module

- main 555c427 📦 NEW: first work on the request. New Mutation `createRequestMutation`.

## v0.1.7 3ffb632 Update and Bug Fix on createRequestMutation

- `createRequestMutation` bug fix to support any location id sent and it now returns a Request object.
- `createSubscriptionMutation` now returns vcSubscription object.
- Create new mutation `acceptPickupRequest` and `sendOutPickup`
- Add `fetchAllRequest` and `fetchOneRequest` query to fetch request by the admin.
- Add `fetchBooking` and `fetchOneBooking` query to booking from TimeKit.

## v0.1.8 bb4467f Setup the addItemToCloset and createOutfit

- `addItemToCloset` and `createOutfit` mutation created.
- stylist implemented - `createStylist`, `updateStylistMutation`, `fetchOneStylist` and `fetchAllStylist`.
- `fetchOneOutfit` and `fetchAllOutfit` query created to fetch outfit
- `fetchUserCloset`, `fetchOneItem` and `fetchAllItem` query to fetch closet of the `me` - current logged in user and item.
- `fetchDashboard` query for admin and outfit data structure modified.
- `newRequest` subscription created.
- update creating Delivery type of request.
- add field `category` and `liked` to type `Outfit`. Create and input `OutfitInput` and created mutation `updateUserOutfitMutation`, `addItemToOutfit`, `likeAnOutfit` and `unlikeAnOutfit`.
- Fix big on `makePayment` to return current subscription plan of the user.
