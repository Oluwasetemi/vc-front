import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const requestSchema = new mongoose.Schema(
  {
    numberOfItems: {
      type: Number,
    },
    type: {
      type: String,
      enum: ['Pickup', 'Delivery', 'Stylist', 'Outfit', 'HelpMePack'],
      default: 'Pickup',
    },
    pickupLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    bookingId: {type: String},
    datetimePicked: {type: String},
    contactPhoneNumber: {type: String},
    metaData: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ['Active', 'Confirmed', 'UnConfirmed', 'Pending'],
      default: 'UnConfirmed',
    },
    catalogueItems: {
      type: Boolean,
      default: false,
    },
    returnDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// requestSchema.index({name: 'text', email: 'text'});

//Export the model
const Request = mongoose.model('Request', requestSchema);

export default Request;
