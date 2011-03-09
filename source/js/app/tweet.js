function Tweet()
{
	// Private
	
	var self = this;
	var verified;
	var element;
	var rendered = false;
	var profileImg;
	var bioModal;
	var followModal;
	var reTweetModal;
	var replyModal;
	var nominees = [ 'Chris_Sanders_',
					 'DanaBrunetti',
					 'DavidORussell',
					 'Bedlam_Gareth',
					 '_HelenaBCarter_',
					 'joshfoxintlwow',
					 'leeunkrich',
					 'Mruff221',
					 'sebastianjunger',
					 'TimHetherington',
					 'saranesson',
					 'suncomeupfilm',
					 'yangruby',
					 'igorstudios', 
					 'arrahman',
					 'trent_reznor',
					 'troyverges',
					 'didoofficial'
				   ];
				
	//  Public
	
	this.htmlText;
	this.tweetID;
	this.type 		= null;
	this.setData 	= setData;
	this.html;
	this.celeb 		= false;
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
	this.hasqTip = false;
	
	function setData(d)
	{
		self.tweetText	= d.text;
		self.htmlText 	= TweetParser.parse(d.text);
		self.tweetID 	= d.id_str;
		// Log('date: '+d.created_at);
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
		celebBadge	 	= (self.celeb) ? celebBadge : '';
	};
	
	
	function getHTML()
	{
		var bioButton;
		
		element = $(render());
		if( isNominee(self.screenName)) 
		{
			$('<span class="badge-nominee">Nominee</span>').insertAfter(element.find('.tweet-name-full'));
		}
		if(verified) $('<span class="badge-celebrity">Celeb</span>').insertAfter(element.find('.tweet-name-full'));
		

		
		if(self.type == 'viewer')
		{
			bioButton = element.find('.expert-bio');
			bioButton.remove();
		}
		decorate(element);
		element.css({position:"relative"});
		element.css({opacity:0, top:-10});

		return element;
	}
	
	
	function onClickRetweet()
	{
	}
	
	
	function onClickReply()
	{
	}
	
	function onClickFollow()
	{
	}	
	
	function onTweetOver() {e.find('.tweet-utility').fadeTo('fast', 1); };
	function onTweetOut() { e.find('.tweet-utility').fadeTo('fast', .2); };
	
	function render()
	{
		return'<div class="tweet">'+
			  '   <div class="tweet-bg">'+
			  '       <div class="tweet-profile-image">'+
			  '		      <a href="http://www.twitter.com/#!/'+self.screenName+'" target="_blank" ><img src="'+profileImg+'" alt="'+self.userName+'" /></a>'+
			  ' 	  </div>'+
			  '       <div class="tweet-copy-block">'+
			  ' 	      <div class="tweet-name">'+
			  '	              <a class="tweet-name-screen" target="_blank" href="http://www.twitter.com/#!/'+self.screenName+'" title="'+self.userName+'">@'+self.screenName+'</a> <span class="tweet-name-full">'+self.userName+'</span>'+celebBadge+'<a href="#'+self.userName+'_bio" class="expert-bio">Bio</a>'+
			  '           </div>'+
			  ' 	      <div class="tweet-text">'+
			  '	              '+self.htmlText+''+
			  '	          </div>'+
			  '		      <div class="tweet-utility">'+
			  '		          <a target="_blank" href="http://www.twitter.com/#!/'+self.screenName+'/status/'+self.tweetID+'" class="tweet-timestamp" title="'+self.time+'">'+self.time+'</a> <span class="tweet-actions"><a href="#retweet" class="action-retweet" title="Retweet"><span><i><!--icon--></i><b>Retweet</b></span></a><a href="#reply" class="action-reply" title="Reply"><span><i><!--icon--></i><b>Reply</b></span></a><a href="#follow" class="action-follow" title="Follow"><span><i><!--icon--></i><b>Follow</b></span></a></span>'+
			  '		      </div>'+
			  '	      </div>'+
			  '   </div>'+
			  '</div>';
	};
	
	
	function isNominee( sName )
	{
		for( var i in nominees)
		{
			if(sName == nominees[i]) return true;
		}
		
		return false;
	}
	
	
	function decorate(e)
	{			
		e.find('.action-follow').click(onClickFollow);
		e.find('.tweet-utility').fadeTo('fast', .2);
		
		e.hover(
			function(){$(this).find('.tweet-utility').stop().fadeTo('slow', 1) } , 
			function(){$(this).find('.tweet-utility').stop().fadeTo('slow', .2) }
			);
		
		/*
			qTip Modals
		*/
		
		if(self.type != 'viewer') bioModal = new TweetUtilsWindows().bioModal( self, e );
		reTweetModal = new TweetUtilsWindows()
		reTweetModal.reTweetModal( self, e );
		
		followModal	 = new TweetUtilsWindows()
		followModal.followModal( self, e );
		
		replyModal   = new TweetUtilsWindows()
		replyModal.replyModal( self, e );
	}
	
	function parseDate( d )
	{
		var date = d.slice(0,-19);
		return date;
	}
	return this;
};