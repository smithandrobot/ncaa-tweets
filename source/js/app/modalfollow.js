ModalFollow.prototype 	= new EventDispatcher();
ModalFollow.constructor 	= ModalFollow;

function ModalFollow( overlay ) 
{
	var element 	= $('#modal-follow-template');
	var overlay		= overlay;
	var img			= null;
	var rendered	= false;
	var state		= 'closed';
	var user		= null;
	var self		= this;
	var followType	= null;
	
	this.tweetProxy = null;
	this.tweet		= null;
	this.open 	 	= open;
	
	overlay.addEventListener('onModalOverlayClose', onClose)
	decorateBTNS();
	initCSS();
	
	
	function open( tweet )
	{

		self.tweet = tweet;
		followType = tweet.followType;
		if( tweet ) setContent( tweet );	
		user = tweet.screenName;
		Log('follow user: '+user+ ' followType: '+followType)
		
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
		var type = (followType == 'Follow') ? 'Follow' : 'Unfollow';
		var dialog;
		var confirmatin;
		
		if(type == 'Follow')
		{
			dialog = 'Start following<br /><span class="red">'+t.screenName+'</span>';
		}else{
			dialog = 'Unfollow<br /><span class="red">'+t.screenName+'</span>';			
		}
		
		if(type == 'Follow')
		{
			confirmation = 'You are now following<br /><span class="red">'+t.screenName+'</span>'
		}else{
			confirmation = 'You have unfollowed<br /><span class="red">'+t.screenName+'</span>';			
		}
		
		element.find('.modal-dialog').append().html(dialog);
		element.find('.confirmation').append().html(confirmation);
		
		var button		= element.find('#follow-type');
		
		if(type == 'Follow') 
		{
			button.removeClass('modal-unfollow-button');
			button.addClass('modal-follow-button');
		}
		
		if(type == 'Unfollow') 
		{
			button.removeClass('modal-follow-button');
			button.addClass('modal-unfollow-button');
		}
		
	}
	
	function showConfirmScreen()
	{
		var cs = element.find('.confirmation-screen');
		var as = element.find('.action-screen');
		var es = element.find('.error-screen');
		
		self.tweet.toggleFollow();
		
		es.hide();
		as.hide();
		cs.show();
	}
	
	
	function showActionScreen()
	{
		var cs = element.find('.confirmation-screen');
		var as = element.find('.action-screen');
		var es = element.find('.error-screen');
		
		es.hide();	
		cs.hide();
		as.show();
	}
	
	
	function showErrorScreen()
	{
		var cs = element.find('.confirmation-screen');
		var as = element.find('.action-screen');
		var es = element.find('.error-screen');
		
		es.show();
		as.hide();
		cs.hide();
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


	function onFollow()
	{
		if( !canFollow() ) return;
		
		var t = self.twitterProxy.twitterOBJ;
		Log(followType+' user: '+user)
		var callbacks = {success: showConfirmScreen, error: showErrorScreen };
		var u = t.User.find( user );
		if(followType == 'Follow')
		{
			u.follow(callbacks);
		}else{
			u.unfollow(callbacks);
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
		
		var fBtn = element.find('.modal-follow-button');
		fBtn.click(onFollow);
		fBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
		
		var okBtn = element.find('.modal-confirm-button');
		okBtn.click(onClose);
		okBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
	}
	
	function initCSS()
	{
		element.css('position', 'fixed');
		position( false );
	}
	
	
	function canFollow()
	{
		var validUser = false;
		var t = self.twitterProxy.twitterOBJ;
		
		if(t.isConnected())
		{
			validUser = true;
		}else{		
			t.bind("authComplete", onFollow);
			t.signIn();
		}	
		
		return validUser;
	};
	
	return this;
};
