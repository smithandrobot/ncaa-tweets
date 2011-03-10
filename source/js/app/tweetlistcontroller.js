// inherits from
TweetListController.prototype = new EventDispatcher();
TweetListController.constructor = TweetListController;

function TweetListController() 
{
	var feed		= null;
	var feedURL		= null;
	var feedColor	= null;
	var tweets		= null;
	var model 		= new TRModel();
	var feedServer 	= 'http://tweetriver.com/smithandrobot/';
	var currentFeed	= null;
	var rendered 	= false;
	var loader		= $('#tweet-team-loader');
	var element 	= $('#main-timeline');
	var feeds 		= [
			  		   {id:'all', color: '#ED1F24', url : feedServer + 'javascript.json'},
			  		   {id: 99, url : feedServer + 'actionscript.json'}
			  		  ];
	
	this.setFeed = setFeed;
	
	model.addEventListener('onDataChange', onDataChange);
	Tweet.constructor.tweetTemplate = $('#template-tweet').html();
	$('#template-tweet').remove();
	
	setFeed( 'all' );
	
	function setFeed( id )
	{
		var f = getFeedData( id );
		if(!f) 
		{
			Log('** FEED NOT FOUND **') ;
			return;
		}
		currentFeed = id;
		rendered = false;
		model.setStream( feedURL );
		model.load();
		loader.show();
	}
	
	
	function getFeedData( id )
	{
		var i;
		var feed;
		
		for(i in feeds)
		{
			feed = feeds[i];
			if(feed.id === id) 
			{
				feedURL = feed.url;
				feedColor = feed.color;
				return feedURL;
			}
		}
		return false;
	}
	
	
	function onDataChange( e )
	{
		if(!rendered)
		{
			loader.hide();
			writeList( e );
		}else{
			
		}
	}
	
	
	function writeList( e )
	{
		var data  = e.target.getData();
		var i 	  = 0;
		var total = data.length-1;
		var t;
		var tHTML;
		
		tweets = new Array();
		
		for(i;i<=total;i++)	
		{
			t = new Tweet();
			t.setData(data[i]);
			element.append(t.getHTML());
		};
		
		element.find('.tweet')

		removeScrollbar();
		addScrollbar();
		updateColors();
		
		dispatchEvent('tweetListLoaded', self);
		
		lastID = data[0].order_id;	
		rendered = true;
	}
	
	function updateColors()
	{
		$('.team-tweets-css-scrollbar .scrollbar-handle').css('background-color', feedColor);
		$('#timeline .tweet-bg a -.tweet-utility').css('color', feedColor);
		$('.spirit-bubble').css('background-color', feedColor);
		$('#loadmore a').css('background-color', feedColor);
	}
	
	
	function addScrollbar()
	{
		$('.team-tweets-css-scrollbar').scrollbar({handleHeight:60, arrows:false});
	}
	
	function removeScrollbar()
	{
		var l = $('#loadmore').detach();
		$("#timeline .scrollbar-pane").remove();
		$("#timeline .scrollbar-handle-container").remove();
		$("#timeline .scrollbar-handle-up").remove();
		$("#timeline .scrollbar-handle-down").remove();
		$("#timeline").prepend(l);	
	}
	
	return this;
};
