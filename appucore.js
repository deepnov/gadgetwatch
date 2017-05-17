require('./routes/product.js')();
require('./routes/event.js')();
xml2js = require('xml2js');

//Declare variables
var DB_NAME='appucore',
LOCAL_DB_URL='mongodb://127.0.0.1:27017/'+DB_NAME,
mongoose = require('mongoose'),
jsonp = require("jsonpointer"),
rest = require('restler'),
MONGODB_URI = (process.env.OPENSHIFT_NODEJS_IP)?process.env.OPENSHIFT_MONGODB_DB_URL+DB_NAME:LOCAL_DB_URL,
Schema = mongoose.Schema,
feedSchema = new Schema({any: Schema.Types.Mixed }, { strict: false }),
Feed = mongoose.model('Feed',feedSchema,'feed'),
Product = mongoose.model('Product'),
Event = mongoose.model('Event'),
RSH = require('./RequestSignatureHelper').RequestSignatureHelper;

//Database connection initialization
mongoose.connect(MONGODB_URI);

//Utility functions
String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};

Array.prototype.contains = function(elem)
{
   for (var i in this)
   {
       if (this[i] == elem) return true;
   }
   return false;
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

//DB functions
function UpdateFeedRecord(_id){

var conditions = { _id: _id }
  , update = { ran_once:true}
  , options = { multi: true };
Feed.update(conditions, update, options, callback);
}
function callback (err, numAffected) {
  console.log(numAffected+" ran_once flag updated for feed ");
}

//Core Main
function startCore(){

 	console.log('Starting Core...');

  try { 
		//insert main

		var db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function callback () {
		//callback # 1

		console.log('DB connected.');
		
	      var action = function (err, collection) {
		//callback # 2
		
		collection.find({'active':true}).toArray(function(err, results) {
		//callback # 3	
		console.log("");
		if(results.length>0){
		console.log("Active Feeds");
		console.log("============");

	      for(var i=0;i< results.length;i++){ 
		console.log(results[i].retailer_name);
	      var rObj=new RetailObjConstructor(results[i]);
		rObj.loadActiveFeed();  
		}

		}//if no feed
		else{
  		console.log('No active feeds.');
  		console.log('Quitting.');
		process.exit(1);

		}
	      //end callback # 3	
            });
		//end callback # 2	
		};

		mongoose.connection.db.collection('retailers', action);
		//end callback # 1	
		});
  }
  catch (err) {

  		console.log('Error in startCore()');
	      console.log(err);
  }

}


function RetailObjConstructor(retailObj) {
	   
 	   this._id=retailObj._id;
  	   this.limit_per_second=retailObj.limit_per_second;
         this.limit_per_day=retailObj.limit_per_day;
         this.records_limit=retailObj.records_limit;
         this.retailer_name=retailObj.retailer_name;
         this.retailer_website=retailObj.retailer_website;
         this.retailer_img=retailObj.retailer_img;
	   this.apikey=retailObj.apikey;
         this.misckey =retailObj.misckey;
  	   this.rf_ids=retailObj.rf_ids;
	   this.feedObjArray=[];	
	  
}

function FeedObjConstructor(feedObj,retObj) {
	  
	   this._id=feedObj._id;
	   this.c=feedObj.c;
	   this.rid=retObj._id;
	   this.feedObj=feedObj;
         this.records_limit= retObj.records_limit;
     	   this.reqPObj=feedObj.request_params;
         this.base_url=feedObj.base_url;
         this.ran_once=feedObj.ran_once;
         this.paginate=feedObj.paginate;
         this.qs_type=feedObj.qs_type;
         this.http_method=feedObj.http_method;
         this.opFormat=feedObj.format; 
         this.apiKey=retObj.apikey;
         this.miscKey=retObj.misckey;
         this.prod_xpath=feedObj.prod_xpath;
         this.rec_count_xpath=feedObj.rec_count_xpath;
         this.fields=feedObj.fields;	
	   this.filter=feedObj.filter;
         this.filter_arr=feedObj.filters;	
         this.filters=[];	
         this.qs="?";
	   this.categories = {};

	   
}
RetailObj=RetailObjConstructor.prototype;
FeedObj=FeedObjConstructor.prototype;
RecordObj=RecordObjContructor.prototype;

RetailObj.loadActiveFeed = function() {
    var rObj=this;
    var action = function (err, collection) {
    //callback # 4

    collection.find({'active':true,'_id':{$in:rObj.rf_ids}}).toArray(function(err, results) {
    //callback # 5	

    for(var i=0;i<results.length;i++){
    var f=new FeedObjConstructor(results[i],rObj);
    if(!f.feedObj.signed_request)
    f.buildQueryString();
    f.loadActiveFilters();
    if(f.http_method=="GET") {	
    f.hit(1,    f.categories[f.filters[0]]);
    }	
    }

    //end callback # 4	
    });
    //end callback # 5	
    };

    mongoose.connection.db.collection('feed', action);
};


FeedObj.loadActiveFilters = function() {

	for(var i=0; i< this.filter_arr.length;i++){ 
      //for each category ids 

 	if(this.filter_arr[i].active){
	this.filters.push(this.filter_arr[i].id);
      if(this.filter_arr[i].c)this.categories[this.filter_arr[i].id]=this.filter_arr[i].c;	
	}
      }

};

FeedObj.buildQueryString = function() {
	
	   var keysObj=Object.keys(this.reqPObj);
	   for(var j=0;j< keysObj.length;j++){
            
	   //for each request parameters
	   var key=keysObj[j];
	   var obj=this.reqPObj[key];
	   if(this.http_method=="GET"){

          if(typeof obj=="string"){
            this.qs+=key+"="+obj+"&";
	        
		}
		else {
	 	throw Error("Invalid Request Parameters for "+this.base_url);
		}
	    }
	   //end for 
	   }

	   this.qs=this.qs.replace('$apikey$',this.apiKey);
	   this.qs=this.qs.replace('$format$',this.opFormat);
	
	   if(this.qs.lastIndexOf('&')==this.qs.length-1){ 
         this.qs=this.qs.substring(0,this.qs.length-1);
         }
	 
	 
}

FeedObj.hit = function(p,c) {
	 var thisFeed=this;
	 var url=thisFeed.base_url;

	 if(!thisFeed.feedObj.signed_request){
	 //UNSIGNED REQUEST
	 var qs1=thisFeed.qs.replace('$page$',p);

	 if(thisFeed.qs_type=="1F1R") { 
	    url+=qs1+"&"+thisFeed.filter+"="+thisFeed.filters[0]; 

	 }
	 else if(thisFeed.qs_type=="1F1R-PRE") { 

          var categ_str="("+thisFeed.filter+"="+thisFeed.filters[0]+")"; 
	    url+=categ_str+qs1; 
	 }
 	 else if(thisFeed.qs_type=="MF1R"&&thisFeed.filters.length>0){	
	 
	    var categ_list="";
          for(var i=0;i<thisFeed.filters.length;i++)categ_list+=thisFeed.filters[i]+",";
	 
	    categ_list=categ_list.substring(0,categ_list.length-1);
          var categ_str="("+thisFeed.filter+" in ("+categ_list+"))"; 
	    url+=categ_str+qs1; 
 	 }
	 }
	 else {
	 //SIGNED REQUEST

	 var aparams={};
	 aparams["EndPoint"]='webservices.amazon.com';
	 aparams["AWSAccessKeyId"]=thisFeed.apiKey;
	 aparams["AWSSecretKey"]=thisFeed.miscKey;
	 //console.dir(aparams);
	 var signatureHelper = new RSH(aparams);
	 var params=thisFeed.reqPObj;
	 params["ItemPage"]=p;
	 params["AWSAccessKeyId"]=thisFeed.apiKey;
       params["BrowseNode"]=thisFeed.filters[0];
	 delete params["Timestamp"];
	 delete params["Signature"];
	 console.log("Brand: "+params["Brand"]);
	 params = signatureHelper.sign(params);
  	 var queryString = signatureHelper.canonicalize(params);
	 url+=this.qs+queryString;
	 }

	 console.log();
	 console.log("Invoking "+url);

	 rest.get(url).on('complete', function(data,response) {
 	 //callback # 6	
 	 
       if (data instanceof Error) {  
	 console.log('Error: ' + data.message); process.exit(1);
	 } 
	 else {   
	 console.log("SUCCESS: received response");
	 try{

	 if(thisFeed.feedObj.format=="XML"){
	 var parser = new xml2js.Parser();
	 parser.parseString(data, function(err,result){
	 if(err){throw "Error in XML response parsing";process.exit(1);}
	 var data=result;
       var total_records=jsonp.get(data,thisFeed.rec_count_xpath);
	 if(parseInt(total_records)>0||!thisFeed.paginate) {
	 var xpathObj=thisFeed.fields;
   	 var records=jsonp.get(data,thisFeed.prod_xpath);	 	 
       for(var i=0;i<records.length;i++){   
	 var record=new RecordObjContructor(data,xpathObj,i,thisFeed,p,total_records,records.length,c);
	 record.saveProduct();	 
	 }

	 }//end if
       });
       
	 }
	 else{
       try{
  	 var total_records=jsonp.get(data,thisFeed.rec_count_xpath);
       if(parseInt(total_records)>0||!thisFeed.paginate) {
	 var xpathObj=thisFeed.fields;
   	 var records=jsonp.get(data,thisFeed.prod_xpath);
       console.log(records.length+" record(s) for "+thisFeed.filters[0]);
       for(var i=0;i<records.length;i++){   
	 var record=new RecordObjContructor(data,xpathObj,i,thisFeed,p,total_records,records.length,c);
	 if(Number(record.rpid)!=0)
	 record.saveProduct();
	 }

	 }//end if
       }catch(err){console.log(err+" nonxml");console.dir(data);	}
	 }//end not xml
       }
	 catch(err) {

  		console.log('Error in parsing data from feed');
	      dumpError(err); 
		process.exit(1);
	 }
	 }//end else

	 //end callback # 6	
	 });

}

function dumpError(err) {
  if (typeof err === 'object') {
    if (err.message) {
      console.log('\nMessage: ' + err.message)
    }
    if (err.stack) {
      console.log('\nStacktrace:')
      console.log('====================')
      console.log(err.stack);
    }
  } else {
    console.log('dumpError :: [argument is not an object] '+err);
  }
}

function getData(data,fieldpath,i,logic){
/*includes FEED data interpretation logic*/

	try{

	if(logic){
	var dataval=getData(data,fieldpath,i);

      if(logic.operation){
      dataval=dataval.replaceAll("'","");//secure and avoid eval code breaking
      var operation_local=logic.operation.replace("$data$",dataval);

      if(!logic.flip){
      operation_local=logic.operation.replace("$data$","'"+dataval+"'");
	var flip=eval(operation_local);

	return flip;
	}
      else if(eval(operation_local)){

      return logic.flip;
      }
      else if(typeof logic.fail !='undefined'){
      return logic.flop;
      }//end flip flop ladder

      }//end if operation defined     

   	}//end if logic defined     
	return jsonp.get(data,fieldpath.replace("$$",""+i));	

	}
	catch(err){console.log(err);console.log("IN ETL : Field - "+fieldpath+", Row - "+i);process.exit(1);}
}

function RecordObjContructor(data,xpathObj,i,feedObj,p,total_records,total_records_received,c){

    try{
	
	this.rpid=getData(data,xpathObj.rpid.path,i);	
	this.upc=getData(data,xpathObj.upc.path,i);
	this.pname=getData(data,xpathObj.pname.path,i);
	this.purl=getData(data,xpathObj.purl.path,i);
	this.turl=getData(data,xpathObj.turl.path,i);
	this.price=getData(data,xpathObj.price.path,i,xpathObj.price.logic);
	this.avail=getData(data,xpathObj.avail.path,i,xpathObj.avail.logic);
      this.total_records=total_records;
	this.total_records_received=total_records_received;
	this.feedObj=feedObj;
	this.p=p;
	this.c=c;
	this.i=i;
	
    }
    catch(err){
	console.log('Error in parsing product data from feed');
	console.log(err); 
	process.exit(1);
    }
}

RecordObj.UpdateOrInsert=function(err,obj){

       if(err) {
	 throw err;
	 process.exit(1);	 
	 }

	 if(!this.feedObj.ran_once){       
	 if(obj){
	 console.log("There cannot be a product record with same ID when first run(correct the feed URL)");
	 console.dir(obj,this.c);	
	 process.exit(1);
	 }

	 var prd=new Product;
	 prd.rid=this.feedObj.rid;
	 prd.rpid=this.rpid;
	 prd.upc=this.upc;
	 prd.c=this.c;
	 prd.pname=this.pname;
	 prd.purl=this.purl;
	 prd.turl=this.turl;
	 prd.avail=this.avail;
	 prd.price=this.price;
 	 prd.save();
	 //console.dir(prd); 
	 }
	 else if(obj){

	 if(this.avail){
	 var evt=new Event;
	 evt.c=this.c;
	 evt.rid=obj.rid;
	 evt.pid=obj._id;

	 if(obj.price>this.price){
	 evt.type=2;
  	 evt.field.y=this.price;
  	 evt.field.x=obj.price;
	 evt.save();
	 console.log("New Price Drop :"+this.pname) ;
	 }
	 else if(!obj.avail){
	 evt.type=1;
  	 evt.field.y=this.avail;
  	 evt.field.x=obj.avail;
	 evt.save();
	 console.log("New Arrival :"+this.pname) ;
	 }
	 }
	 obj.upc=this.upc;
	 obj.pname=this.pname;
	 obj.purl=this.purl;
	 obj.turl=this.turl;
	 obj.avail=this.avail;
	 obj.price=this.price;
	 obj.udate=new Date;
 	 obj.save();
	 }
	 else{
	 var prd=new Product;
	 prd.rid=this.feedObj.rid;
	 prd.rpid=this.rpid;
	 prd.upc=this.upc;
	 prd.c=this.c;
	 prd.pname=this.pname;
	 prd.purl=this.purl;
	 prd.turl=this.turl;
	 prd.avail=this.avail;
	 prd.price=this.price;

 	 prd.save(function(err,doc){
	 if(err){ console.log(err);process.exit(1);}
	 else{
	 try{
	 //console.log("New Product Added") ;
	 if(prd.avail){
	 var evt=new Event;
	 evt.c=doc.c;
	 evt.type=1;
	 evt.rid=doc.rid;
	 evt.pid=doc._id;
  	 evt.field.y=prd.avail+"";
	 evt.save();
	 console.log("New Arrival :"+doc.pname) ;
	 }
	 }
	 catch(err){
	 console.log(err);
	 console.log("New Arrival event creation problem"); 
	 doc.remove();
	 process.exit(1);
	 }
	 }
	 });//end save callback
	 }

		
		

	 if(!this.feedObj.paginate){
       if(this.i==this.total_records_received-1){
	 	if(this.feedObj.filters.length>1&&this.feedObj.qs_type!="MF1R"){
		delete this.feedObj.categories[this.feedObj.filters[0]];
	 	this.feedObj.filters=this.feedObj.filters.slice(1);
	 	this.feedObj.hit(1,this.feedObj.categories[this.feedObj.filters[0]]); 
	 	}
	 	else{
       	console.log(this.feedObj._id+" feed finished downloading "+this.total_records_received+" record(s) [NOPAGING]");
  	 	if(!this.feedObj.ran_once)UpdateFeedRecord(this.feedObj._id);
	 	}
	 }
	 }
	 else{	
 	 if(this.i==this.total_records_received-1){ 
	 	if(this.p<Math.ceil(this.total_records/this.feedObj.records_limit)){ 
	 	this.feedObj.hit(this.p+1,this.c); 	 
	 	}	        		
	 	else if(this.feedObj.filters.length>1&&this.feedObj.qs_type!="MF1R"){
		delete this.feedObj.categories[this.feedObj.filters[0]];
	 	this.feedObj.filters=this.feedObj.filters.slice(1);
	 	this.feedObj.hit(1,this.feedObj.categories[this.feedObj.filters[0]]); 
	 	}
	 	else{
       	console.log(this.feedObj._id+" feed finished downloading "+this.total_records_received+" record(s) [PAGING]");
  	 	if(!this.feedObj.ran_once)UpdateFeedRecord(this.feedObj._id);
	 	}
	 }
	 }

 	 //end callback # 7

	
}
RecordObj.saveProduct = function() {
try{    
var filterObj={'rpid': this.rpid,'rid':this.feedObj.rid};
Product.findOne(filterObj,this.UpdateOrInsert.bind(this));
}
catch(err){
console.log(err);
console.log("Error while saving product");
}
};


function ask(question, format, callback) {
 var stdin = process.stdin, stdout = process.stdout;
 
 stdin.resume();
 stdout.write(question + ": ");
 
 stdin.once('data', function(data) {
   data = data.toString().trim();
 
   if (format.test(data)) {
     callback(data);
   } else {
     stdout.write("It should match: "+ format +"\n");
     ask(question, format, callback);
   }
 });
}



startCore();
//setInterval(startCore,9000);



