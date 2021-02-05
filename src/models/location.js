import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const locationSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      trim: true,
    },
    current: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// locationSchema.index({name: 'text', email: 'text'});

//Export the model
const Location = mongoose.model('Location', locationSchema);

export default Location;
