import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const outfitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      lowercase: true,
      trim: true,
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
    ],
    /**
     * the owner of the outfits
     */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tags: [
      {
        type: String,
      },
    ],
    recommendations: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

outfitSchema.index({name: 'text', description: 'text'});

//Export the model
const Outfit = mongoose.model('Outfit', outfitSchema);

export default Outfit;
