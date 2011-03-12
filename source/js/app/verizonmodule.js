// inherits from
VerizonModule.prototype = new EventDispatcher();
VerizonModule.constructor = VerizonModule;

function VerizonModule() 
{

	/* PRIVATE */
	
	var element 	= $('#atanywhere-container');
	var self 		= this;
	var model 		= new TRModel();
	var feedServer 	= 'http://tr-cache-2.appspot.com/smithandrobot/';
	var tweet		= null;

	/* PUBLIC */

	this.twitterProxy 	  = null;
	this.twitterReady  	  = twitterReady;
	this.getElement		  = function () { return element.find('.tweet-text'); };
	/* INITIALIZE */
	
	model.addEventListener('onDataChange', onDataChange);
	model.setStream( feedServer + 'actionscript.json' );
	model.load();
	

	function twitterReady( )
	{
		makeTweetBox();
	}
	
	
	function onDataChange( e )
	{
		var data = e.target.getData();
		setData(data[0])
	}
	
	
	function setData(d)
	{
		self.tweetText	= d.text;
		self.htmlText 	= TweetParser.parse(d.text);
		self.tweetID 	= d.id_str;
		self.screenName	= d.user.screen_name;
		self.userName 	= d.user.name;
		
		element.find('.tweet-text').html(self.htmlText);
		decorate( element );
	};

	
	function makeTweetBox()
	{
		var tObj =	{ height: 90,
					  width: 340,
					  defaultContent: "#ncaatourney http://es.pn/eCYCAh",
					  label: "Add your own Tournament Tweet.",
					  complete: styleTweetBox
				    };

		self.twitterProxy.getTweetBox('#tbox', tObj);
	}
	
	
	function onClickReply()
	{
		dispatchEvent('onReply', self);
	}
	
	
	function onClickFollow()
	{
		dispatchEvent('onFollow', self);
	}	
	
	
	function onClickReTweet()
	{
		dispatchEvent('onReTweet', self);
	}
	
	
	function onClickFavorite()
	{
		dispatchEvent('onFavorite', self);
	}
	
	
	function decorate(e)
	{			
		e.find('.action-follow').click(onClickFollow);
		e.find('.action-favorite').click(onClickFavorite);
		e.find('.action-retweet').click(onClickReTweet);
		e.find('.action-reply').click(onClickReply);
	}
	
	
	return this;
};
