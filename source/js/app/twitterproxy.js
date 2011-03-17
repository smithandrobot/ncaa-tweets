TwitterProxy.prototype = new EventDispatcher();
TwitterProxy.constructor = TwitterProxy;

function TwitterProxy() 
{
	var twitterOBJ		= null;
	var self 			= this;
	this.isConnected 	= isConnected;
	this.twitterOBJ 	= null;
	this.getTweetBox	= getTweetBox;
	this.loggedIn		= false;
	
	twttr.anywhere( init );
		
	function init( t )
	{
		twitterOBJ = t;

		self.twitterOBJ = t;
		dispatchEvent('onReady', self);

		twitterOBJ.bind("authComplete", signIn);
		twitterOBJ.bind("signOut", signOut);
		
		if( isConnected() ) signIn();
	}


	function isConnected()
	{
		if(!twitterOBJ) return false;
		return twitterOBJ.isConnected();
	}
	
	
	function signIn()
	{
		self.loggedIn = true;
		dispatchEvent('onLoggedInStateChanged', self);
	}
	
	function signOut()
	{
		self.loggedIn = false;
		dispatchEvent('onLoggedInStateChanged', self);
	}
	
	
	function getTweetBox( id , obj )
	{
		twitterOBJ(id).tweetBox(obj);
	}
	
	return this;
};
