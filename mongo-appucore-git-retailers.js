
/** retailers indexes **/
db.getCollection("retailers").ensureIndex({
  "_id": NumberInt(1)
},[
  
]);

/** retailers records **/
db.getCollection("retailers").insert({
  "_id": ObjectId("536a389cab7cb5c3b56d0405"),
  "limit_per_second": 1,
  "limit_per_day": null,
  "records_limit": 10,
  "retailer_name": "Amazon",
  "retailer_website": "http://www.amazon.com",
  "retailer_img": "",
  "apikey": "XXXXXXXXXXXXXXXXXX",
  "misckey": "XXXXXXXXXXXXXXXX",
  "active": true,
  "rf_ids": [
    ObjectId("53e8d6c767ae5bbf50cadd2b"),
    ObjectId("54020b088e26d6382da16b54"),
    ObjectId("54030bf88e26d6382da16b56"),
    ObjectId("54030baa8e26d6382da16b55")
  ]
});
db.getCollection("retailers").insert({
  "_id": ObjectId("5368e9a1ab7cb5c3b56d0404"),
  "limit_per_second": 5,
  "limit_per_day": 50000,
  "records_limit": 100,
  "retailer_name": "BestBuy",
  "retailer_website": "http://www.bby.com",
  "retailer_img": "",
  "apikey": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "misckey": "",
  "active": true,
  "rf_ids": [
    ObjectId("53e8d85a67ae5bbf50cadd2c")
  ]
});
db.getCollection("retailers").insert({
  "_id": ObjectId("5368e95eab7cb5c3b56d0403"),
  "limit_per_second": 5,
  "limit_per_day": 50000,
  "records_limit": 10,
  "retailer_name": "Walmart",
  "retailer_website": "http://www.walmart.com",
  "retailer_img": "",
  "apikey": "XXXXXXXXXXXXXXXXXX",
  "misckey": "",
  "active": true,
  "rf_ids": [
    ObjectId("53e8da2167ae5bbf50cadd2d"),
    ObjectId("53e8db1e67ae5bbf50cadd2e")
  ]
});
