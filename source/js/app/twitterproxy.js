TwitterProxy.prototype = new EventDispatcher();
TwitterProxy.constructor = TwitterProxy;

function TwitterProxy() 
{
	var twitterOBJ	= null;
	var self 		= this;
	this.ready		= false;

	twttr.anywhere( init );
		
	function init( t )
	{
		twitterOBJ = t;
	}
		
	return this;
};
