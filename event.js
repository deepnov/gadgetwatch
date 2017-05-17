var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
module.exports = function() {
var EventSchema = new Schema({
  _id:  {type: Schema.Types.ObjectId, default: function () { return new ObjectId()} },
  c:  Number,
  rid:  { type: Schema.Types.ObjectId, ref: 'Retailer' },
  pid:  { type: Schema.Types.ObjectId, ref: 'Product' },
  type:  Number,
  field: {x:String,y:String},
  cdate: { type: Date, default: Date.now }
});
mongoose.model('Event', EventSchema,'events');
};
