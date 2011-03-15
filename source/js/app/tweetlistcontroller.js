TweetListController.prototype = new EventDispatcher();
TweetListController.constructor = TweetListController;

function TweetListController() 
{
	var UPDATE		= 1000*10;
	var startUpTimer= 1500;
	var autoStartInt= null;
	var feed		= null;
	var feedURL		= null;
	var feedColor	= null;
	var tweets		= null;
	var newTweets	= null;
	var model 		= new TRModel();
	var updateModel = new TRModel();
	// http://tr-cache-2.appspot.com/massrelevance/oscars-all/meta.json
	var feedServer 	= 'http://tr-cache-2.appspot.com/smithandrobot/';
	var currentFeed	= null;
	var rendered 	= false;
	var updateInt	= null;
	var loader		= $('#tweet-team-loader');
	var element 	= $('#main-timeline');
	var lastID
	var verizonModule = new VerizonModule();
	
	/* Tweet Modals */
	
	
	var modalOverlay  = new ModalOverlay();
	var retweetModal  = new ReTweetModal( modalOverlay );
	var favoriteModal = new FavoriteModal( modalOverlay );
	var replyModal    = new ModalReply( modalOverlay );
	var followModal   = new ModalFollow( modalOverlay );
	var photoModal	  = new ModalPhoto( modalOverlay );
	var modalTweetBox = new ModalTweetBox( modalOverlay );
	var twitterProxy  = new TwitterProxy();
	twitterProxy.addEventListener('onReady', verizonModule.twitterReady)
	// set twitter proxies
	
	favoriteModal.twitterProxy 	= twitterProxy;
	modalOverlay.twitterProxy	= twitterProxy;
	retweetModal.twitterProxy 	= twitterProxy;
	favoriteModal.twitterProxy 	= twitterProxy;
	replyModal.twitterProxy 	= twitterProxy;
	followModal.twitterProxy 	= twitterProxy;
	photoModal.twitterProxy 	= twitterProxy;
	modalTweetBox.twitterProxy 	= twitterProxy;
	verizonModule.twitterProxy  = twitterProxy;
	
	this.setFeed 		= setFeed;
	this.selectTeam 	= selectTeam;
	this.hashTagClick 	= hashTagClick;
	this.toString		= toString;
	
	addListeners( verizonModule );
	
	model.addEventListener('onDataChange', onDataChange);
	updateModel.addEventListener('onDataChange', onDataUpdate);
	
	enableShowAllTeams();
	enableTweetBubble();
	enableLoadMore();
	
	Tweet.constructor.tweetTemplate = $('#template-tweet').html();
	$('#template-tweet').remove();

	autoStartInt = setTimeout(autoStart, startUpTimer);
	
	function autoStart()
	{
		selectTeam( {team:{displayName:'ALL TEAMS', shortName:'all', name:'ALL TEAMS', color:'#ED1F24'}} );
	}
	
	function selectTeam( team )
	{
		clearInterval(autoStartInt);

		var obj 	= team.team;
		var name 	= (team.team.displayName) ? team.team.displayName : obj.name;
		var hState 	= (name.indexOf("ALL TEAMS") == -1) ? 'show': 'hide';
		var f 		= 'http://tweetriver.com/mr_mm_2011/mm-2011-'+obj.shortName+'-curated.json';
		feedColor 	= obj.color;
		
		setFeed( f );
		updateColors();
		toggleStreamHeader( hState, team.team.hashTag);
		setTeamName( name );
	} 
	
	
	function setFeed( feedURL )
	{
		$('#loadmore-count').hide();
	   	removeScrollbar();
		model.setStream( feedURL );
		updateModel.setStream( feedURL );
		model.load();
		removeTweets();
		loader.show();
	}
	
	function poll()
	{
		updateModel.poll(lastID);
		updateTweets();
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
	
	
	function onDataUpdate( e )
	{
		Log('updating new tweets: '+e.target.getData().length);
		var data = e.target.getData();
		var total = data.length-1;
		var i = 0;
		var t;
		
		if(total >= 0)
		{
			$('#loadmore-count').text((total+1)+' New Tweets');
			$('#loadmore-count').fadeIn(300);
			newTweets = new Array();
			i = 0;
			for(i;i<=total;i++)	
			{
				t = new Tweet();
				t.setTwitterAPI(twitterProxy);
				t.setData(data[i]);
				newTweets.push(t)
			}
		}else{
			$('#loadmore-count').fadeOut(300);
		}
		clearInterval(updateInt);
		updateInt = setTimeout(poll, UPDATE);
	}
	
	
	function onDataChange( e )
	{	
		loader.hide();
		writeList( e );
	}
	
	
	function writeList( e )
	{
		var data  = e.target.getData();
		var i 	  = 0;
		var total = data.length-1;
		var t	  = null;
		tweets 	  = new Array();
		
		element.css('opacity', 0);

		$('#loadmore-count').hide();
		$('#loadmore').show(); // need to show the container only once
		
		for(i;i<=total;i++)	
		{
			t = new Tweet();
			t.setTwitterAPI(twitterProxy);
			tweets.push(t);
			addListeners( t );
			t.setData(data[i]);
			element.append(t.getHTML());
		};

	   addScrollbar();
	   updateColors();
	   element.animate({'opacity':1}, 500);
	   dispatchEvent('tweetListLoaded', self);
	   
	   lastID = data[0].order_id;	
	   rendered = true;

		clearInterval(updateInt);
		updateInt = setTimeout(poll, UPDATE);
	}
	
	
	function updateList()
	{
		clearInterval(updateInt);
		removeScrollbar();
		$('#loadmore-count').hide();
		var total = newTweets.length-1;
		var t	  = null;
		var i     = 0;
		
	   	lastID = newTweets[0].orderID;
		Log('last id: '+lastID);
		newTweets.reverse();
		
		for(i;i<=total;i++)	
		{
			t = newTweets[i];
			tweets.unshift(t)
			addListeners( t );
			element.prepend(t.getHTML());
		};

	   	addScrollbar();
		updateColors();
		clearInterval(updateInt);
		updateInt = setTimeout(poll, UPDATE);
	}
	
	
	function removeTweets()
	{
		if(!tweets) return;
		
		var i 	  = 0;
		var total = tweets.length-1;
		var t;

		for(i;i<=total;i++)	
		{
			t = tweets[i];
			t.remove();
		};
	}
	

	function updateTweets()
	{
		if(!tweets) return;
		
		var i 	  = 0;
		var total = tweets.length-1;
		var t;

		for(i;i<=total;i++)	
		{
			t = tweets[i];
			t.updateTime();
		};
	}
	
	
	function hashTagClick( h )
	{
		modalTweetBox.open( h )
	}
	
	function onReTweet( e )
	{
		retweetModal.open(e.target);
	}
	
	function onFavorite( e )
	{
		favoriteModal.open(e.target);
	}
	
	function onReply( e )
	{
		replyModal.open(e.target);
	}
	
	function onFollow( e )
	{
		followModal.open(e.target);
	}
	
	function onPhotoClick( e )
	{
		photoModal.open( e.target );
	}


	function openSpiritBubble()
	{
 		var t = $('.spirit-bubble').text(); 
		modalTweetBox.open(t); 
	}
	
	
	function enableShowAllTeams()
	{
		var s = $('#show-all-streams');
		s.click( function(){ $.cookie('team', null, {path:'/'}); selectTeam( {team:{displayName:'ALL TEAMS', shortName:'all', name:'ALL TEAMS', color:'#ED1F24'}} ); } );
		s.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
		
	}
	
	function enableLoadMore()
	{
		var s = $('#loadmore-count');
		s.click( updateList );
	}
	
	
	function enableTweetBubble()
	{
		var tb = $('.spirit-bubble');
		tb.click( openSpiritBubble );
		tb.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
	}
	
	function addListeners( t )
	{
		t.addEventListener('onReTweet', onReTweet);
		t.addEventListener('onFavorite', onFavorite);
		t.addEventListener('onReply', onReply);
		t.addEventListener('onFollow', onFollow);
		t.addEventListener('onPhotoClick', onPhotoClick);
	}
	
	
	function toggleStreamHeader( state, t )
	{
		if( state == 'show' )
		{
			$('.spirit-bubble').text(t)
			$('#team-selector').hide();
			$('.spirit-bubble').show();	
			$('#show-all-streams').css('text-indent', 0);
		}else{
			$('.spirit-bubble').hide();
			$('#team-selector').show();
			$('#show-all-streams').css('text-indent', -9000);
		}
	}
	
	
	function updateColors()
	{
		$('.team-tweets-css-scrollbar .scrollbar-handle').css('background-color', feedColor);
		$('#timeline .tweet-bg a').not('#timeline .tweet-bg .tweet-utility a').css('color', feedColor);
		$('.spirit-bubble').css('background-color', feedColor);
		$('#loadmore a').css('background-color', feedColor);
		$('#stream-header h2').css('color', feedColor);
		$('#stream-header .meta').css('color', feedColor);
	}
	
	
	function addScrollbar()
	{
		$('.team-tweets-css-scrollbar').scrollbar({handleHeight:60, arrows:false});
	}
	
	function removeScrollbar()
	{
		var l = $('#loadmore').detach();
		var t = $('#main-timeline').detach();
		$("#timeline .scrollbar-pane").remove();
		$("#timeline .scrollbar-handle-container").remove();
		$("#timeline .scrollbar-handle-up").remove();
		$("#timeline .scrollbar-handle-down").remove();
		$("#timeline").prepend(t);
		$("#timeline").prepend(l);
	
	}
	
	function setTeamName( n )
	{
		var orgSize = 25;
		var maxWidth = 220;
		var nameElement = $('#stream-header h2');
		//nameElement.css('font-size', orgSize);
		nameElement.text( n );
		
		Log('name width: '+nameElement.width());
		/*while(nameElement.width() > maxWidth)
		{
		    orgSize -= 1;
			nameElement.css('font-size', orgSize);
		}*/
	}
	
	
	function toString()
	{
		return 'TweetListController';
	}
	
	
	return this;
};
