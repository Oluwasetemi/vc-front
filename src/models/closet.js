import mongoose from 'mongoose'; // Erase if already required
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: 'Item name required',
    },
    // items properties
    material: {
      type: String,
      enum: [
        'Cotton',
        'Wool',
        'Silk',
        'Denim',
        'Leather',
        'Fur',
        'Nylon',
        'Polyester',
        'Metal',
        'Plastic',
        'Suede',
        'Other',
      ],
      default: 'Other',
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'Cocktail',
        'Dinner',
        'Formal',
        'Work',
        'Social',
        'Casual',
        'Other',
      ],
      default: 'Other',
      trim: true,
    },
    type: {
      type: String,
      trim: true,
      default: 'Other',
    },
    feature: {
      type: String,
      trim: true,
      default: 'Other',
    },
    color: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    itemCondition: {
      type: String,
      trim: true,
    },
    tag: {
      type: String,
      trim: true,
      // required: 'Item tag required',
    },
    stat: {
      type: mongoose.Schema.Types.Mixed,
    },
    matchingOutfit: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outfit',
      },
    ],
    pickup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/350.png',
    },
    largeImage: {
      type: String,
      default: 'https://via.placeholder.com/700.png',
    },
  },
  {
    timestamps: true,
  },
);

itemSchema.index({name: 'text'});

// Declare the Schema of the Mongo model
const closetSchema = new mongoose.Schema(
  {
    itemsIn: {
      type: Number,
      default: 0,
    },
    itemsOut: {
      type: Number,
      default: 0,
    },
    items: [
      {
        type: itemSchema,
      },
    ],
  },
  {
    timestamps: true,
  },
);

//Export the model
const Closet = mongoose.model('Closet', closetSchema);

export default Closet;
