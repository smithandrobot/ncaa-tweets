function ReTweetModal( overlay ) 
{
	var element 	= $('#modal-retweet-template');
	var overlay		= overlay;
	var img			= null;
	var rendered	= false;
	var state		= 'closed';
	
	this.tweet		= null;
	this.open 	 	= open;
	
	overlay.addEventListener('onModalOverlayClose', onClose)
	decorateBTNS();
	initCSS();
	
	
	function open( tweet )
	{
		if( tweet ) setContent( tweet );
		
		if( state == 'closed') 
		{
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
		html.find('.tweet-profile-image').remove();
		html.find('.tweet-utility').remove();
		html.find('.tweet-attachment').remove();
		html.find('.tweet-copy-block').css('margin-left', '0px');
		html.find('.tweet-copy-block').css('font-family', 'arial');
		html.find('.tweet-copy-block').css('font-size', '11px');
		$(".modal-tweet-container").html(html);
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
		
	}
	
	function initCSS()
	{
		element.css('position', 'absolute');
		position( false );
	}
	
	return this;
};