FavoriteModal.prototype 	= new EventDispatcher();
FavoriteModal.constructor 	= FavoriteModal;

function FavoriteModal( overlay ) 
{
	var element 		= $('#modal-favorite-template');
	var overlay			= overlay;
	var img				= null;
	var rendered		= false;
	var state			= 'closed';
	var tweetID			= null;
	var self			= this;
	
	this.tweet			= null;
	this.open 	 		= open;
	this.twitterProxy	= null;
	
	overlay.addEventListener('onModalOverlayClose', onClose)
	decorateBTNS();
	initCSS();
	
	
	function open( tweet )
	{
		if( tweet ) setContent( tweet );
		tweetID = tweet.tweetID;
		self.tweet = tweet;
		if( state == 'closed') 
		{
			showActionScreen();
			// showConfirmScreen();
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

		element.find('.modal-dialog').append().html('Favorite this tweet from<br /><span class="red">'+t.screenName+'</span>')
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


	function onFavorite()
	{
		Log('onFavorite');
		if( !canFavorite( tweetID ) ) 
		{
			Log('user did not validate, authorizing...');
			return;
		}
		
		var t = self.twitterProxy.twitterOBJ;
		t.Status.favorite( tweetID );
		showConfirmScreen();
	}
	
	
	function canFavorite()
	{
		
		var validUser = false;
		var t = self.twitterProxy.twitterOBJ;
		if(t.isConnected())
		{
			validUser = true;
		}else{		
			t.bind("authComplete", onFavorite);
			t.signIn();
		}	
		
		return validUser;
	}
	
	
	function decorateBTNS()
	{
		var cBtn = element.find('.close-button');
		cBtn.click(onClose);
		cBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
		
		var cancelBtn = element.find('.modal-cancel-button');
		cancelBtn.click(onClose);
		cancelBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );

		var okBtn = element.find('.modal-confirm-button');
		okBtn.click(onClose);
		okBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
		
		var fvtBtn = element.find('.modal-favorite-button');
		fvtBtn.click(onFavorite);
		fvtBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} )
	}
	
	
	function initCSS()
	{
		element.css('position', 'fixed');
		position( false );
	}
	
	
	return this;
};
