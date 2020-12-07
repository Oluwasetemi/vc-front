import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['REGULAR', 'ADMIN'],
    default: 'REGULAR',
  },
  /**
   * source of the auth default to email with possible option to gmail and twitter
   */
  source: {
    type: String,
    default: 'EMAIL',
    enum: ['EMAIL', 'GOOGLE', 'FACEBOOK'],
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/350.png',
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE'],
    // required: true
  },
  nationality: {type: String, default: 'usa'},
  // reset password details
  resetPasswordExpires: {type: Number},
  resetPasswordToken: {type: String},
  // otp details
  otpExpires: {type: Number},
  otp: {type: String},
  /**
   * The array of the id of the Location
   */
  locations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
    },
  ],
  /**
   * if currentHra?the id of the Location
   */
  currentLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
  },
  closet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Closet',
  },
  vault: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vault',
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reports',
    },
  ],
  pickups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pickup',
    },
  ],
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
    },
  ],
  verified: {
    type: Boolean,
  },
  googleId: {type: String},
  facebookId: {type: String},
});

userSchema.index({name: 'text', email: 'text'});

//Export the model
const User = mongoose.model('User', userSchema);

export default User;
