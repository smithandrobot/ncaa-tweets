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
	
	this.getElement	= function () { return element; };
	
	mediaParser.addEventListener('onImageData', onImageData);
	
	function setData(d)
	{
		self.tweetText	= d.text;
		self.htmlText 	= TweetParser.parse(d.text);
		self.tweetID 	= d.id_str;
		// Log(d.created_at);
		self.time		= parseDate(d.created_at);
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
		element.find('.tweet-name a').attr('href', 'http://www.twitter.com/#!/'+self.screenName);
		element.find('.tweet-name a').attr('title', self.userName);
		element.find('.tweet-name-full').text(self.userName);
		element.find('.tweet-name a').text(self.screenName);
		element.find('.tweet-profile-image a').attr('href', 'http://www.twitter.com/#!/'+self.screenName);
		element.find('.tweet-profile-image a img').attr('src', profileImg);
		element.find('.tweet-text').html(self.htmlText);
		
		mediaParser.getImage(self.tweetText);
		decorate(element);

		return element;
	}
	
	
	function onImageData( e )
	{
 	 	var thumb		= new Image();
		thumb.onload 	= decorateImg;
		// thumb.onerror	= removeImg
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
	
	function removeImg( )
	{
		var height = element.height();
		element.css('height', height);
		element.find('.tweet-attachment').remove();
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
		dispatchEvent('onFavorite', self);
	}
	
	
	function onPhotoClick()
	{
		Log('image: '+self.largeImage);
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
	
	function parseDate( d )
	{
		var date = d.slice(0,-19);
		return date;
	}
	
	return this;
};