TwitterProxy.prototype = new EventDispatcher();
TwitterProxy.constructor = TwitterProxy;

function TwitterProxy() 
{
	var twitterOBJ		= null;
	var self 			= this;
	this.isConnected 	= isConnected;
	this.twitterOBJ 	= null;
	this.getTweetBox	= getTweetBox;
	
	twttr.anywhere( init );
		
	function init( t )
	{
		twitterOBJ = t;
		self.twitterOBJ = t;
		dispatchEvent('onReady', self);
	}

	function isConnected()
	{
		Log('self.twitterOBJ: isConnected');
		return twitterOBJ.isConnected();
	}
	
	
	function getTweetBox( id , obj )
	{
		twitterOBJ(id).tweetBox(obj);
	}
	
	return this;
};
