#!/usr/local/bin/node

/***********************************************************/

var bodyParser      = require('body-parser');
var multer 			= require('multer');
var express         = require('express');
var https           = require('https');
var fs              = require('fs');
var log4js 			= require('log4js');
var config 			= require('./config');
var dbConfig 		= config.default_config;

/***********************************************************/
/***********************************************************/

var WS_HOST       			= '0.0.0.0';
var WS_PORT       			= 4443;
var HTTPS_SERVER_KEY        = config.ssl.server_key;
var HTTPS_SERVER_CERT       = config.ssl.server_cert;
var HTTPS_SERVER_INTER_CERT = config.ssl.server_inter_cert;
const SW_HOST = "swapi.co";
const SW_HOST_PATH = "/api/people/";

/***********************************************************/

var logger;
var app;
initConfig();
initExpressServer();
process.on('uncaughtException', function(exception) {
	logger.error("Error no capturado:: " + exception);
	logger.error("Error stack:: "+exception.stack);
});


/***********************************************************/

function initConfig() {

	logger = log4js.getLogger('logfile');

	log4js.configure({
	    "appenders": [{
	  		type: "console",
	        category: "console"
	    }, {
	        "type": "file",
	        "filename": config.logs.filename,
	        "maxLogSize": config.logs.maxLogSize,
	        "backups": config.logs.rotates,
	        "category": "logfile"
	    }]
	});
	logger.setLevel(config.logs.level);
	logger.info('Starting express server for ' + config.app_name );
	logger.info('Memory usage: ' + process.memoryUsage().rss);
}

/***********************************************************/

function initExpressServer() {

	app = express();

	var options = {
	    key: fs.readFileSync(HTTPS_SERVER_KEY),
	    cert: fs.readFileSync(HTTPS_SERVER_CERT),
	    ca: fs.readFileSync(HTTPS_SERVER_INTER_CERT)
	};

	app.use(bodyParser.json({limit:10000000})); // to support JSON-encoded bodies
	app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	    extended: true
	}));

	https.createServer(options, app).listen(WS_PORT, function() {
	    logger.info('Express server listening on port ' + WS_PORT);
	});

	var storage = multer.memoryStorage();
	app.use(multer({ storage: storage }).any());
}




/***********************************************************/
/********************* POST METHODS ************************/
/***********************************************************/

app.post('/getStarWarsName', function(req, res) {
	getStarWarsData(req, res);
});




/***********************************************************/
/******************* GENERIC FUNCTIONS *********************/
/***********************************************************/




function getStarWarsData(myReq, myRes){
	var http = require('http');
	var options = {
	  host: SW_HOST,
	  path: SW_HOST_PATH
	};
	var result = '';
	var req = http.get(options, function(res) {
	  
		
	  // Buffer the body entirely for processing as a whole.
	  var bodyChunks = [];
	  res.on('data', function(chunk) {
	    // You can process streamed parts here...
	    result+=chunk;
	  }).on('end', function() {
	  	var fullData = JSON.parse(result);
	    //var body = Buffer.concat(bodyChunks).toString();
	    var response = [];
	    if(fullData && fullData.results){
	    	fullData.results.forEach(function(item){
	    		response.push(item.name);
	    	});
	    }
	    myRes.send({nombres:response}).status( 200 ).end();
	    // ...and/or process the entire body here.
	  })
	});

	req.on('error', function(e) {
	  logger.error('ERROR: ' + e.message);
	});
}


