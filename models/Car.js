const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
  brand: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0,
    required: true
  },
  user:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  status:{
    type: Schema.Types.String,
    default: 'недоставена',
    required: true
  },
});

module.exports = mongoose.model('Car', carSchema);