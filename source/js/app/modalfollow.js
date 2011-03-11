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
	this.tweet		= null;
	this.open 	 	= open;
	
	overlay.addEventListener('onModalOverlayClose', onClose)
	decorateBTNS();
	initCSS();
	
	
	function open( tweet )
	{
		if( tweet ) setContent( tweet );
		user = tweet.screenName;
		
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

		element.find('.modal-dialog').append().html('Start following<br /><span class="red">'+t.screenName+'</span>');
		element.find('.confirmation').append().html('You are now following<br /><span class="red">'+t.screenName+'</span>');
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


	function onFollow()
	{
		if( !canFollow( user ) ) return;
		twttr.anywhere
		(
			function (T) 
			{
				var user = T.User.find( user );
				user.follow();
				showConfirmScreen();
			}
		);
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
		element.css('position', 'absolute');
		position( false );
	}
	
	
	function canFollow( userID )
	{
		var validUser = false;
		
		twttr.anywhere(function (T) 
		{  
 			if (!T.isConnected()) {
				T.bind("authComplete", function (e, user) {
					var user = T.User.find( userID );
					user.follow();
					showConfirmScreen();
  		 		});

				T.signIn();
				Log('user is not logged in and cannot follow, opened connect dialog');
			}else{
				validUser = true;
			}
		})
		
		return validUser;
	};
	
	return this;
};
