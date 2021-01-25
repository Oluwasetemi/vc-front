import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const stylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    bio: {
      type: String,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/350.png',
    },
    /**
     * the user who has requested for this stylist
     */
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        default: [],
      },
    ],
    strength: [
      {
        type: String,
        trim: true,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

// add the first two letter of the name of the stylist to create an image from placeholder.com
stylistSchema.pre('save', async function (next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  const nameArray = this.name.split(' ');
  // loop thru all the value and pick the first letter
  let firstLetter = '';
  for (const name of nameArray) {
    firstLetter += name[0].toUpperCase();
  }
  this.image = `https://via.placeholder.com/512x512.png/9C9B7C/F2F2F2?text=${firstLetter}`;

  next();
});

stylistSchema.index({name: 'text', email: 'text'});

//Export the model
const Stylist = mongoose.model('Stylist', stylistSchema);

export default Stylist;
