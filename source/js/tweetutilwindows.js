function TweetUtilsWindows()
{

	var element;
	var tweet;
	var modal;
	var replyID;
	var loadingStatus;
	var isIE = $.browser.msie;
	var isFF = $.browser.mozilla;
	var time;
	
	this.bioModal 	  = setBioModal;
	this.replyModal   = setReplyModal;
	this.reTweetModal = setReTweetModal;
	this.followModal  = setFollowModal;
	this.writeTweetBox = writeTweetBox;
	
	function setBioModal( t , e )
	{

		tweet 			 = t;
		var bioModal 	 = e.find('.expert-bio');

		
		var qTipObj 	 = {};
		var settings	 = getQtipSettingsObj();
		qTipObj.content  = getBioContent();
		qTipObj.position = { corner: { target: 'topMiddle', tooltip: 'bottomMiddle'}, adjust: { x: 0, y: 0, screen: true } };						
		qTipObj.style    = settings.style;
		qTipObj.hide	 = settings.hide;
		qTipObj.show	 = settings.show;
		qTipObj.exclusive= true;
		
		decorateCloseBtn(qTipObj.content);
		bioModal.qtip(qTipObj);
		t.bioModal = true;
		modal = bioModal;
		return self;
	}

	
	function setReplyModal( t , e )
	{
		tweet 			 = t;
		time		 	 = new Date().getTime();
		var replyModal 	 = e.find('.action-reply');
		var qTipObj 	 = new Object();
		var settings	 = getQtipSettingsObj();
		qTipObj.content	 = new Object();
		qTipObj.content.text  = getReplyContent();
		qTipObj.position = { corner: { target: 'topMiddle', tooltip: 'bottomMiddle'}, adjust: { x: 0, y: 15 } };						
		qTipObj.style    = settings.style;
		qTipObj.hide	 = settings.hide;
		qTipObj.show	 = settings.show;
		qTipObj.api		 = {
							 onRender: writeTweetBox 
							};
		
		decorateCloseBtn(qTipObj.content.text);
		replyModal.qtip(qTipObj);
		modal = replyModal;
		return self;
	}
		
	
	function setReTweetModal( t , e )
	{
		tweet 			 = t;
		var reTweetModal = e.find('.action-retweet');
		var qTipObj 	 = {};
		var settings	 = getQtipSettingsObj();
		qTipObj.content = getReTweetContent();
		qTipObj.position = { corner: { target: 'topMiddle', tooltip: 'bottomMiddle'}, adjust: { x: 0, y: 15 } };
		qTipObj.style    = settings.style;
		qTipObj.hide	 = settings.hide;
		qTipObj.show	 = settings.show;

		
		decorateCloseBtn(qTipObj.content);
		decorateCancelBtn(qTipObj.content);
		decorateRetweetBtn(qTipObj.content);
		
		reTweetModal.qtip(qTipObj);
		modal = reTweetModal;
		return self;
	}
	
	
	function setFollowModal( t, e )
	{
		tweet 			 = t;
		var followModal  = e.find('.action-follow');
		var qTipObj 	 = {};
		var settings	 = getQtipSettingsObj();
		qTipObj.content  = getFollowContent();
		qTipObj.position = { corner: { target: 'topMiddle', tooltip: 'bottomMiddle'}, adjust: { x: 0, y: 15 } };
		qTipObj.style    = settings.style;
		qTipObj.hide	 = settings.hide;
		qTipObj.show	 = settings.show;
		
		decorateCloseBtn(qTipObj.content);
		decorateCancelBtn(qTipObj.content);
		decorateFollowBtn(qTipObj.content);
		
		followModal.qtip(qTipObj);

		modal = followModal;
		return self;
	}
	
	
	function getQtipSettingsObj()
	{
		var obj		 = new Object();
		obj.style 	 = { tip: false,
							 background: 'none',
                			 padding: 0,
							 border: false,
				 			 width: { min: 294 }
					    };
		obj.hide 	 = { fixed: true };
		obj.show 	 = { delay: 0, when:'click' };
		return obj;
	}
	
	
	function getBioContent()
	{
		var c = $('#modal-storage .modal-bio').clone();
		c.find('h5').text(tweet.userName);
		c.find('.mini').text(tweet.bio);
		c.find('#modal-bio-screen-name').text('@'+tweet.screenName);
		c.find('.bio-tweets .bio-tweet-count').text( Utils.addCommas( tweet.tweets ) );
		c.find('.bio-following .bio-tweet-count').text( Utils.addCommas( tweet.following ) );
		c.find('.bio-followers .bio-tweet-count').text( Utils.addCommas( tweet.followers ) );
		
		return c;
	}
	
	
	function getReTweetContent()
	{
		var c = $('#modal-storage .modal-retweet').clone();
		c.find('.mini').text('Reweet this from '+tweet.userName+'?');
		c.find('#modal-retweet-content').html(tweet.htmlText);
		
		return c;
	}
	
	
	function getFollowContent()
	{
		var c = $('#modal-storage .modal-follow').clone();
		c.find('p').text('Start Following '+tweet.userName+' (@'+tweet.screenName+')?');
		
		return c;
	}
	
	
	function getReplyContent()
	{
		var c = $('#modal-storage .modal-reply').clone(true);
		c.find('#tbox-reply').attr('id', 'tweetbox-'+tweet.tweetID+'-'+time+'-reply');
		var p = c.find('p');
		p.text('Loading Tweetbox');
		p.attr('id', 'modal-'+tweet.tweetID+'-loading-status');
		return c;
	}
	
	
	function decorateCloseBtn( e )
	{
		var cBtn = $(e).find('.close-botton');
		cBtn.click(onClose);
		cBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
	}
	
	
	function decorateCancelBtn( e )
	{
		var reTweetCancelBtn = $(e).find('.button-cancel');
		reTweetCancelBtn.click(onClose);	
	}
	
	
	function decorateFollowBtn( c )
	{
		var followBtn = $(c).find('.button-follow');
		followBtn.click( followUser );
	}
	
	
	function decorateRetweetBtn( c )
	{
		var retweetBtn = $(c).find('.button-retweet');
		retweetBtn.click( reTweet )
	}
	
	
	function followUser()
	{
		if( !canFollow( tweet.screenName ) ) return;
		
		twttr.anywhere
			(
				function (T) 
				{
					var user = T.User.find( tweet.screenName );
					user.follow();
				}
			);
			
		modal.qtip( "hide" );
	}
	
	
	function reTweet()
	{
		
		if( !canRetweet( tweet.tweetID ) ) 
		{
			Log('user did not validate, authorizing...');
			return;
		}
		

		
		twttr.anywhere
		(		
			function (T) 
			{
				var status = T.Status.retweet(tweet.tweetID);
			}
		);
		
		modal.qtip( "hide" );
	}
	
	
	function writeTweetBox()
	{
		function writeBox()
		{	
			twttr.anywhere
			(
				function (T) 
				{
				  T('#tweetbox-'+tweet.tweetID+'-'+time+'-reply').tweetBox
					(
						{
				    		height: 70,
				    		width: 230,
				    		defaultContent: '@'+tweet.screenName,
							complete: onTweetBoxLoaded,
				    		label: "",
							data:{ 'in_reply_to_status_id' : tweet.tweetID } 
				  		}
					);
				}
			);
			
			$('#modal-'+tweet.tweetID+'-loading-status').remove();

		}
		
		if(isIE || isFF)
		{
			var api = modal.qtip("api");
			setTimeout(writeBox, 1500);
		}else{
			writeBox();
		}
	}
	
	
	function onTweetBoxLoaded(tb)
	{
		var api = modal.qtip("api");
			api.updatePosition();
		styleTweetBox();
	}
	
	
	function styleTweetBox()
	{
		var tweetBox	= $('#tweetbox-'+tweet.tweetID+'-'+time+'-reply');
		var label 		= tweetBox.find('iframe').contents().find("label");
		var textarea 	= tweetBox.find('iframe').contents().find("#tweet-box");
		var counter 	= tweetBox.find('iframe').contents().find("#counter");

		label.css('font-size', 16);
		label.css('color', "#ccc");

		counter.css('color', "#666");
		counter.css('text-align', 'right');
		counter.css('width', 80);
		counter.css('font-size', 16);
		
		textarea.css('font-size', 11);
	};
	
	
	function canRetweet( tweetID )
	{
		
		var validUser = false;

		twttr.anywhere(function (T) 
		{  
 			if (!T.isConnected()) {
	
				T.bind("authComplete", function (e, user) {
					Log('sending retweet id: '+tweetID);
					var status = T.Status.retweet(tweetID);
  		 		});

				T.signIn();
				Log('user is not logged in');
			}else{
				validUser = true;
			}
		})
		
		return validUser;
		

	}
	
	
	function canFollow( userID )
	{
		var validUser = false;
		
		twttr.anywhere(function (T) 
		{  
 			if (!T.isConnected()) {
				T.bind("authComplete", function (e, user) {
					Log('following user: '+userID);
					var user = T.User.find( userID );
					user.follow();
  		 		});

				T.signIn();
				Log('user is not logged in and cannot follow, opened connect dialog');
			}else{
				validUser = true;
			}
		})
		
		return validUser;
	};
	
	
	function onClose()
	{
		modal.qtip( "hide" );
		return false;
	};
	
	return this;
};
