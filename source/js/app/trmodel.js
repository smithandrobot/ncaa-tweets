TRModel.prototype = new EventDispatcher();
TRModel.constructor = TRModel;
TRModel.constructor.id = 0;

function TRModel( URL )
{	
	var self 			= this;
	var pollInterval 	= 1000;
	var stream 			= URL;
	var data			= null;
	var loaded 			= false;
	var date 			= new Date();
	var type			= null;
	var maxAttempts 	= 5;
	var attempt 		= 0;
	var attemptInterval = 1000*1;
	var error 			= false;
	var loadCallback	= null;
	var attemptInt		= null;
	
	this.name  		= 'model'
	this.id 		= "TR_MODEL_"+(++TRModel.constructor.id);

	this.getStream 	= function() { return stream; };
	this.setStream 	= function( s ) { stream = s; };
	this.getData 	= function() { return data; };
	this.setType 	= function(t) { type = t; };
	this.getType 	= function() { return type; };
	
	this.load 		= loadCustomCallBack;
	this.loadJSON 	= loadJSON;
	this.toString 	= function() { return "TRModel: "+this.id};
	this.poll 		= poll;
	this.trCallback = trCallback;
	
	
	function onStreamError (xmlhttp, txtstatus, errorThrown)
	{
		error = true;
		++attempt;
		if(attempt >= maxAttempts) 
		{
			Log('attempt: '+attempt+' stopping further attempts in stream: '+stream);
			clearInterval(attemptInt);
			dispatchEvent("onModelError", self);
			return;
		}
		
		Log('unable to load stream attempt: '+attempt+' stream: '+stream);
		clearInterval(attemptInt);
		attemptInt = setTimeout(loadCallback, attemptInterval);
	}

	function onStreamLoaded(d)
	{
		error = false;
		data = d;
		dispatchEvent("onDataChange", self);
	}
	
	
	function loadCustomCallBack( sinceID , callback)
	{
		var aObj 			 = {};
		var callbackName 	 = 'trCallback_'+String(self.id)+'_x';
		var since 			 = ( sinceID ) ? '?since_id='+sinceID : '';
        loadCallback 		 = loadCustomCallBack
		window[callbackName] = self.trCallback;
		
		aObj.url 			 = stream+since;
		if( callback ) aObj.jsonp = callback;
		aObj.cache 			 = true;
		aObj.dataType 		 = 'jsonp';
		aObj.success 		 = onStreamLoaded;
		aObj.error 			 = onStreamError;
		aObj.jsonpCallback   = callbackName;
		
 		$.ajax(aObj); 
	}
	
	
	function loadJSON()
	{
	    loadCallback = loadJSON
		var aObj 		= {};		
		aObj.url 		= stream
		aObj.cache 		= false;
		aObj.dataType 	= 'json';
		aObj.success 	= onStreamLoaded;
		aObj.error 		= onStreamError;		
 		$.ajax(aObj); 
	}

	
	function poll( sinceID ) { loadCustomCallBack( sinceID ) };
		
	function trCallback( d ) { }
		
	return this;
};

