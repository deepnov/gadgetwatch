
/** feed indexes **/
db.getCollection("feed").ensureIndex({
  "_id": NumberInt(1)
},[
  
]);

/** feed records **/
db.getCollection("feed").insert({
  "_id": ObjectId("53e8da2167ae5bbf50cadd2d"),
  "active": false,
  "c": 2,
  "paginate": true,
  "ran_once": false,
  "base_url": "http://walmartlabs.api.mashery.com/v1/search",
  "http_method": "GET",
  "format": "json",
  "prod_xpath": "/items",
  "page_count_xpath": "",
  "rec_count_xpath": "/totalResults",
  "last_run_date": "",
  "last_run_success": "",
  "qs_type": "1F1R",
  "filter": "categoryId",
  "filters": [
    {
      "id": "3944_1078524_1078084",
      "active": true
    },
    {
      "id": "3944_96469_164001",
      "active": true
    },
    {
      "id": "3944_542371_1072335",
      "active": true
    },
    {
      "id": "1105910_1073085",
      "active": true
    }
  ],
  "request_params": {
    "query": "tablet",
    "responseGroup": "full",
    "format": "$format$",
    "apiKey": "$apikey$",
    "start": "$page$"
  },
  "fields": {
    "rpid": "/items/$$/itemId",
    "upc": "/items/$$/upc",
    "pname": "/items/$$/name",
    "purl": "/items/$$/productUrl",
    "turl": "/items/$$/thumbnailImage",
    "price": "/items/$$/salePrice",
    "avail": "/items/$$/stock"
  }
});
db.getCollection("feed").insert({
  "_id": ObjectId("53e8db1e67ae5bbf50cadd2e"),
  "c": 2,
  "active": true,
  "paginate": false,
  "ran_once": true,
  "base_url": "http://api.walmartlabs.com/v1/feeds/items",
  "http_method": "GET",
  "format": "json",
  "prod_xpath": "/items",
  "page_count_xpath": "",
  "rec_count_xpath": "/totalResults",
  "last_run_date": "",
  "last_run_success": "",
  "qs_type": "1F1R",
  "filter": "categoryId",
  "filters": [
    {
      "id": "3944_96469_164001",
      "c": 3,
      "active": true
    },
    {
      "id": "3944_1078524_1078084",
      "c": 2,
      "active": true
    },
    {
      "id": "3944_542371_1072335",
      "c": 1,
      "active": true
    },
    {
      "id": "1105910_1073085",
      "c": 1,
      "active": true
    }
  ],
  "request_params": {
    "format": "$format$",
    "apiKey": "$apikey$"
  },
  "fields": {
    "rpid": {
      "path": "/items/$$/itemId"
    },
    "upc": {
      "path": "/items/$$/upc"
    },
    "pname": {
      "path": "/items/$$/name"
    },
    "purl": {
      "path": "/items/$$/productUrl"
    },
    "turl": {
      "path": "/items/$$/thumbnailImage"
    },
    "price": {
      "path": "/items/$$/salePrice"
    },
    "avail": {
      "path": "/items/$$/stock",
      "logic": {
        "operation": "/^Available/i.test('$data$')",
        "flip": true,
        "flop": false
      }
    }
  }
});
db.getCollection("feed").insert({
  "_id": ObjectId("53e8d85a67ae5bbf50cadd2c"),
  "base_url": "http://api.remix.bestbuy.com/v1/products",
  "active": true,
  "c": 2,
  "paginate": true,
  "ran_once": true,
  "http_method": "GET",
  "format": "json",
  "prod_xpath": "/products",
  "page_count_xpath": "/totalPages",
  "rec_count_xpath": "/total",
  "last_run_date": "",
  "last_run_success": "",
  "qs_type": "1F1R-PRE",
  "filter": "categoryPath.id",
  "filters": [
    {
      "id": "pcmcat209000050006",
      "c": 2,
      "active": true
    },
    {
      "id": "abcat0201000",
      "c": 3,
      "active": true
    },
    {
      "id": "abcat0800000&categoryPath.id!=abcat0811002",
      "c": 1,
      "active": true
    }
  ],
  "request_params": {
    "format": "$format$",
    "apiKey": "$apikey$",
    "page": "$page$",
    "pageSize": "100",
    "show": "all"
  },
  "fields": {
    "rpid": {
      "path": "/products/$$/productId"
    },
    "upc": {
      "path": "/products/$$/upc"
    },
    "pname": {
      "path": "/products/$$/name"
    },
    "purl": {
      "path": "/products/$$/url"
    },
    "turl": {
      "path": "/products/$$/mediumImage"
    },
    "price": {
      "path": "/products/$$/salePrice"
    },
    "avail": {
      "path": "/products/$$/onlineAvailability"
    }
  }
});
db.getCollection("feed").insert({
  "_id": ObjectId("53e8d6c767ae5bbf50cadd2b"),
  "base_url": "http://webservices.amazon.com/onca/xml",
  "c": 2,
  "active": true,
  "paginate": true,
  "ran_once": true,
  "http_method": "GET",
  "format": "XML",
  "signed_request": true,
  "prod_xpath": "/ItemSearchResponse/Items/0/Item",
  "page_count_xpath": "/ItemSearchResponse/Items/0/TotalPages/0",
  "rec_count_xpath": "/ItemSearchResponse/Items/0/TotalResults/0",
  "last_run_date": "",
  "last_run_success": "",
  "qs_type": "1F1R",
  "filter": "BrowseNode",
  "filters": [
    {
      "id": "1232597011",
      "c": 2,
      "active": true
    },
    {
      "id": "2407747011",
      "c": 1,
      "active": true
    }
  ],
  "request_params": {
    "AWSAccessKeyId": "$apikey$",
    "AssociateTag": "superappu-20",
    "BrowseNode": "$filter$",
    "Brand": "Amazon",
    "Condition": "New",
    "ItemPage": "$page$",
    "MerchantId": "Amazon",
    "Operation": "ItemSearch",
    "ResponseGroup": "Images,ItemAttributes,Offers",
    "SearchIndex": "Electronics",
    "Service": "AWSECommerceService",
    "Version": "2011-08-01"
  },
  "fields": {
    "rpid": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ASIN/0"
    },
    "upc": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ItemAttributes/0/UPC/0"
    },
    "pname": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ItemAttributes/0/Title/0"
    },
    "purl": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/DetailPageURL/0"
    },
    "turl": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ImageSets/0/ImageSet/0/TinyImage/0/URL/0"
    },
    "price": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ItemAttributes/0/ListPrice/0/FormattedPrice/0",
      "logic": {
        "operation": "$data$.replace('$','')",
        "flop": 0
      }
    },
    "avail": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/Offers/0/Offer/0/OfferListing/0/Availability/0",
      "logic": {
        "operation": "/^Usually ship/i.test('$data$')",
        "flip": true,
        "flop": false
      }
    }
  }
});
db.getCollection("feed").insert({
  "_id": ObjectId("54020b088e26d6382da16b54"),
  "base_url": "http://webservices.amazon.com/onca/xml",
  "c": 2,
  "active": true,
  "paginate": true,
  "ran_once": true,
  "http_method": "GET",
  "format": "XML",
  "signed_request": true,
  "prod_xpath": "/ItemSearchResponse/Items/0/Item",
  "page_count_xpath": "/ItemSearchResponse/Items/0/TotalPages/0",
  "rec_count_xpath": "/ItemSearchResponse/Items/0/TotalResults/0",
  "last_run_date": "",
  "last_run_success": "",
  "qs_type": "1F1R",
  "filter": "BrowseNode",
  "filters": [
    {
      "id": "1232597011",
      "c": 2,
      "active": true
    },
    {
      "id": "2407747011",
      "c": 1,
      "active": true
    }
  ],
  "request_params": {
    "AWSAccessKeyId": "$apikey$",
    "AssociateTag": "superappu-20",
    "BrowseNode": "$filter$",
    "Brand": "Samsung",
    "Condition": "New",
    "ItemPage": "$page$",
    "MerchantId": "Amazon",
    "Operation": "ItemSearch",
    "ResponseGroup": "Images,ItemAttributes,Offers",
    "SearchIndex": "Electronics",
    "Service": "AWSECommerceService",
    "Version": "2011-08-01"
  },
  "fields": {
    "rpid": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ASIN/0"
    },
    "upc": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ItemAttributes/0/UPC/0"
    },
    "pname": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ItemAttributes/0/Title/0"
    },
    "purl": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/DetailPageURL/0"
    },
    "turl": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ImageSets/0/ImageSet/0/TinyImage/0/URL/0"
    },
    "price": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ItemAttributes/0/ListPrice/0/FormattedPrice/0",
      "logic": {
        "operation": "$data$.replace('$','')",
        "flop": 0
      }
    },
    "avail": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/Offers/0/Offer/0/OfferListing/0/Availability/0",
      "logic": {
        "operation": "/^Usually ship/i.test('$data$')",
        "flip": true,
        "flop": false
      }
    }
  }
});
db.getCollection("feed").insert({
  "_id": ObjectId("54030baa8e26d6382da16b55"),
  "base_url": "http://webservices.amazon.com/onca/xml",
  "c": 2,
  "active": true,
  "paginate": true,
  "ran_once": true,
  "http_method": "GET",
  "format": "XML",
  "signed_request": true,
  "prod_xpath": "/ItemSearchResponse/Items/0/Item",
  "page_count_xpath": "/ItemSearchResponse/Items/0/TotalPages/0",
  "rec_count_xpath": "/ItemSearchResponse/Items/0/TotalResults/0",
  "last_run_date": "",
  "last_run_success": "",
  "qs_type": "1F1R",
  "filter": "BrowseNode",
  "filters": [
    {
      "id": "1264866011",
      "c": 3,
      "active": true
    },
    {
      "id": "1232597011",
      "c": 2,
      "active": true
    },
    {
      "id": "2407747011",
      "c": 1,
      "active": true
    }
  ],
  "request_params": {
    "AWSAccessKeyId": "$apikey$",
    "AssociateTag": "superappu-20",
    "BrowseNode": "$filter$",
    "Brand": "Sony",
    "Condition": "New",
    "ItemPage": "$page$",
    "MerchantId": "Amazon",
    "Operation": "ItemSearch",
    "ResponseGroup": "Images,ItemAttributes,Offers",
    "SearchIndex": "Electronics",
    "Service": "AWSECommerceService",
    "Version": "2011-08-01"
  },
  "fields": {
    "rpid": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ASIN/0"
    },
    "upc": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ItemAttributes/0/UPC/0"
    },
    "pname": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ItemAttributes/0/Title/0"
    },
    "purl": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/DetailPageURL/0"
    },
    "turl": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ImageSets/0/ImageSet/0/TinyImage/0/URL/0"
    },
    "price": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ItemAttributes/0/ListPrice/0/FormattedPrice/0",
      "logic": {
        "operation": "$data$.replace('$','')",
        "flop": 0
      }
    },
    "avail": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/Offers/0/Offer/0/OfferListing/0/Availability/0",
      "logic": {
        "operation": "/^Usually ship/i.test('$data$')",
        "flip": true,
        "flop": false
      }
    }
  }
});
db.getCollection("feed").insert({
  "_id": ObjectId("54030bf88e26d6382da16b56"),
  "base_url": "http://webservices.amazon.com/onca/xml",
  "c": 2,
  "active": true,
  "paginate": true,
  "ran_once": true,
  "http_method": "GET",
  "format": "XML",
  "signed_request": true,
  "prod_xpath": "/ItemSearchResponse/Items/0/Item",
  "page_count_xpath": "/ItemSearchResponse/Items/0/TotalPages/0",
  "rec_count_xpath": "/ItemSearchResponse/Items/0/TotalResults/0",
  "last_run_date": "",
  "last_run_success": "",
  "qs_type": "1F1R",
  "filter": "BrowseNode",
  "filters": [
    {
      "id": "1264866011",
      "c": 3,
      "active": true
    }
  ],
  "request_params": {
    "AWSAccessKeyId": "$apikey$",
    "AssociateTag": "superappu-20",
    "BrowseNode": "$filter$",
    "Brand": "SanDisk",
    "Condition": "New",
    "ItemPage": "$page$",
    "MerchantId": "Amazon",
    "Operation": "ItemSearch",
    "ResponseGroup": "Images,ItemAttributes,Offers",
    "SearchIndex": "Electronics",
    "Service": "AWSECommerceService",
    "Version": "2011-08-01"
  },
  "fields": {
    "rpid": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ASIN/0"
    },
    "upc": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ItemAttributes/0/UPC/0"
    },
    "pname": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ItemAttributes/0/Title/0"
    },
    "purl": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/DetailPageURL/0"
    },
    "turl": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ImageSets/0/ImageSet/0/TinyImage/0/URL/0"
    },
    "price": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/ItemAttributes/0/ListPrice/0/FormattedPrice/0",
      "logic": {
        "operation": "$data$.replace('$','')",
        "flop": 0
      }
    },
    "avail": {
      "path": "/ItemSearchResponse/Items/0/Item/$$/Offers/0/Offer/0/OfferListing/0/Availability/0",
      "logic": {
        "operation": "/^Usually ship/i.test('$data$')",
        "flip": true,
        "flop": false
      }
    }
  }
});
