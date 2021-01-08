import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
    },
    amount: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      trim: true,
      enum: ['sub', 'addon', 'onDemand'],
      default: 'sub',
    },
    services: {
      type: mongoose.Schema.Types.Mixed,
    },
    stripeProductId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

//Export the model
const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
