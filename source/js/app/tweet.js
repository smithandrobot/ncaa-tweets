Tweet.prototype = new EventDispatcher();
Tweet.constructor = Tweet;
function Tweet()
{
	// Private
	
	var self = this;
	var verified;
	var element = null;
	var rendered = false;
	var profileImg;
	var mediaParser = new MediaParser();
	//  Public
	
	this.htmlText;
	this.tweetID;
	this.type 		= null;
	this.setData 	= setData;
	this.html;
	this.getHTML 	= getHTML;
	this.orderID;
	this.tweetText;
	this.time;
	this.screenName;
	this.userName;
	this.bio;
	this.followers;
	this.following;
	this.tweets;
	this.largeImage;
	this.remove = remove;
	this.updateTime = updateTime;
	this.twitterAPI;
	
	this.getElement	= function () { return element; };
	this.twitterAPI.addEventListener('onLoggedInStateChanged', onLoggedStateChange);
	// this.twitterAPI.addEventListener('onLoggedInStateChanged', onLoggedStateChange);
	mediaParser.addEventListener('onImageData', onImageData);
	
	function setData(d)
	{
		self.tweetText	= d.text;
		self.htmlText 	= TweetParser.parse(d.text);
		self.tweetID 	= d.id_str;
		self.timeStamp	= d.created_at;
		self.time		= parseDate();
		verified 	 	= d.user.verified;
		self.screenName	= d.user.screen_name;
		self.userName 	= d.user.name;
		self.bio		= d.user.description;
		self.followers  = d.user.followers_count;
		self.following	= d.user.friends_count;
		self.tweets		= d.user.statuses_count;
		self.orderID	= d.order_id;
		profileImg	 	= d.user.profile_image_url;
	};
	
	
	function getHTML()
	{
		element = $(Tweet.constructor.tweetTemplate);
		element.attr('id', 'tweet-'+self.tweetID+'-'+new Date().getTime())
		element.find('.tweet-timestamp a').text(self.time);
		element.find('.tweet-timestamp a').attr('href', 'http://www.twitter.com/#!/'+self.screenName+'/status/'+self.tweetID);
		element.find('.tweet-name a').attr('href', 'http://www.twitter.com/#!/'+self.screenName);
		element.find('.tweet-name a').attr('title', self.userName);
		element.find('.tweet-name-full').text(self.userName);
		element.find('.tweet-name a').text(self.screenName);
		element.find('.tweet-profile-image a').attr('href', 'http://www.twitter.com/#!/'+self.screenName);
		element.find('.tweet-profile-image a img').attr('src', profileImg);
		element.find('.tweet-profile-image a img').attr('width', 48);
		element.find('.tweet-profile-image a img').attr('height', 48);
		element.find('.tweet-text').html(self.htmlText);
		
		if(!mediaParser.getImage(self.tweetText))
		{
			element.find('.tweet-attachment').remove();
		};
		
		decorate(element);

		return element;
	}
	
	
	function onImageData( e )
	{
 	 	var thumb		= new Image();
		thumb.onload 	= decorateImg;
		thumb.onerror	= removeImg
		thumb.src 	 	= e.target.thumb;
		self.largeImage	= e.target.largeImage;
		
		element.find('.tweet-attachment').css('background-image','url('+thumb.src+')');
	}
	
	
	function decorateImg()
	{
		var photo = element.find('.tweet-attachment');
		photo.click(onPhotoClick);
		photo.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
	}
	
	function remove()
	{
		element.remove();
	}
	
	function updateTime()
	{
		self.time = parseDate();
		element.find('.tweet-timestamp a').text(self.time);
	}
	
	
	function removeImg( )
	{
		var height = element.height();
		element.css('height', height);
		element.find('.tweet-attachment').remove();
	}
	
	
	function onLoggedStateChange( e )
	{
		Log('logged in state changed to: '+e.target.loggedIn);
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
		Log('onClickReTweet');
		dispatchEvent('onReTweet', self);
	}
	
	function onClickFavorite()
	{
		//var e = e.find('.action-favorite')
		var type = $(this).text();
		Log('type: '+type)
		if(type == 'Favorite') $(this).find('b').text('Unfavorite');
		if(type == 'Unfavorite') $(this).find('b').text('Favorite');
		
		dispatchEvent('onFavorite', self);
	}
	
	
	function onPhotoClick()
	{
		dispatchEvent('onPhotoClick' , self);
	}
	
	
	function onTweetOver() {e.find('.tweet-utility').fadeTo('fast', 1); };
	function onTweetOut() { e.find('.tweet-utility').fadeTo('fast', .2); };

	
	
	function decorate(e)
	{			
		e.find('.action-follow').click(onClickFollow);
		e.find('.action-favorite').click(onClickFavorite);
		e.find('.action-retweet').click(onClickReTweet);
		e.find('.action-reply').click(onClickReply);
		e.find('.tweet-utility').fadeTo('fast', .5);
		
		e.hover(
			function(){$(this).find('.tweet-utility').stop().fadeTo('slow', 1) } , 
			function(){$(this).find('.tweet-utility').stop().fadeTo('slow', .5) }
			);
	}
	
	function parseDate()
	{
		var t = TimeStamp.timeSince( self.timeStamp );
		if(t.days > 0)
		{
			var d = t.days == 1 ? 'day' : 'days'
			return t.days+' '+d+' ago';
		}
		
		if(t.hours > 0)
		{
			var h = t.hours == 1 ? 'hour' : 'hours'
			return t.hours+' '+h+' ago';
		}
		
		if(t.minutes > 0)
		{
			var m = t.minutes == 1 ? 'minute' : 'minutes'
			return t.minutes+' '+m+' ago';
		}
		
		if( t.seconds < 1 ) return 'less than a second ago';
		
		var s = t.seconds == 1 ? 'second' : 'seconds';
		return t.seconds+' '+s+' ago';
	}
	
	return this;
};