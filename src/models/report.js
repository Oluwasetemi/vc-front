import mongoose from 'mongoose'; // Erase if already required

// Declare the Schema of the Mongo model
const reportSchema = new mongoose.Schema(
  {
    numberOfItems: {
      type: Number,
    },
    type: {
      type: String,
      enum: ['Inventory'],
      default: 'Inventory',
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
    datetimePicked: {type: String},
    // no of items,Accessories, Dresses, Shoes
    // remove shirts and pants
    stats: {
      type: mongoose.Schema.Types.Mixed,
    },
    condition: {
      type: String,
      default: 'good',
      trim: true,
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
const Report = mongoose.model('Report', reportSchema);

export default Report;
