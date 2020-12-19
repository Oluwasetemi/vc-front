import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const locationSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      unique: true,
      trim: true,
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
