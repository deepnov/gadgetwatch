var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
module.exports = function() {
var ProductSchema = new Schema({
  _id:  {type: Schema.Types.ObjectId, default: function () { return new ObjectId()} },
  c:  Number,
  rid:  Schema.Types.ObjectId,
  rpid:  String,
  upc: String,
  pname:   String,
  purl:   String,
  turl:   String,
  price: String,   
  avail: String,   
  udate: { type: Date, default: Date.now },
  cdate: { type: Date, default: Date.now }
});
mongoose.model('Product', ProductSchema,'product');
};
