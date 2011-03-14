function ReTweetModal( overlay ) 
{
	var element 		= $('#modal-retweet-template');
	var overlay			= overlay;
	var img				= null;
	var rendered		= false;
	var state			= 'closed';
	var tweetID			= null;
	var self			= this;
	
	this.twitterProxy 	= null;
	this.tweet			= null;
	this.open 	 		= open;
	
	overlay.addEventListener('onModalOverlayClose', onClose)
	decorateBTNS();
	initCSS();
	
	
	function open( tweet )
	{
		setContent( tweet );
		tweetID = tweet.tweetID;
		
		if( state == 'closed') 
		{
			showActionScreen();
			element.css('z-index', overlay.z+1)
			element.fadeIn(250);
			overlay.open();
		}		
		position();
		state = 'open';
	}
	
	
	function onClose()
	{
		element.fadeOut(250);
		overlay.close();
		state = 'closed';
	}
	
	
	function setContent( t )
	{
		var html = t.getElement().clone();

		element.find('.modal-dialog').text('Retweet this from '+t.screenName)
		element.find('.confirmation').html('You retweeted<br/>'+t.screenName+'\'s tweet.')
		html.find('.tweet-profile-image').remove();
		html.find('.tweet-utility').remove();
		html.find('.tweet-attachment').remove();
		html.find('.tweet-copy-block').css('margin-left', '0px');
		html.find('.tweet-copy-block').css('font-family', 'arial');
		html.find('.tweet-copy-block').css('font-size', '11px');
		$(".modal-tweet-container").html(html);
	}
	
	
	function showConfirmScreen()
	{
		var cs = element.find('.confirmation-screen');
		var as = element.find('.action-screen');
		
		as.hide();
		cs.show();
	}
	
	
	function showActionScreen()
	{
		var cs = element.find('.confirmation-screen');
		var as = element.find('.action-screen');	
		cs.hide();
		as.show();
	}
	
	
	function position( animate )
	{				
    	var docY = ($(window).height() / 2) - 100;
    	var docX = $(document).width() / 2;	
		var height = element.height() / 2;
		var width = element.width() / 2;
		var top = (docY - height < 0) ? 10 : docY - height;
		var left = docX - width;
		
		var propObject = {};
		propObject.left = left;
		propObject.top = top;
		if(animate)
		{ 
			element.animate(propObject, 250);
		}else{
			element.css(propObject);
		}
	}


	function decorateBTNS()
	{		
		var cBtn = element.find('.close-button');
		cBtn.click(onClose);
		cBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
		
		var cancelBtn = element.find('.modal-cancel-button');
		cancelBtn.click(onClose);
		cancelBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
		// 
		var rtBtn = element.find('.modal-retweet-button');
		rtBtn.click(onRetweet);
		rtBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
		
		var okBtn = element.find('.modal-confirm-button');
		okBtn.click(onClose);
		okBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
	}
	
	
	function onRetweet()
	{
		if( !canRetweet( tweetID ) ) 
		{
			Log('user did not validate, authorizing...');
			return;
		}
		
		var t = self.twitterProxy.twitterOBJ;
		t.Status.retweet( tweetID );
		showConfirmScreen();
	}
	
	
	function canRetweet()
	{
		var validUser = false;
		var t = self.twitterProxy.twitterOBJ;
		
		if(t.isConnected())
		{
			validUser = true;
		}else{		
			t.bind("authComplete", onRetweet);
			t.signIn();
		}	
		
		return validUser;
	}
	
	
	function initCSS()
	{
		element.css('position', 'fixed');
		position( false );
	}
	
	
	return this;
};
