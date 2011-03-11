function ReTweetModal() 
{
	var element 	= $('#modal-retweet-template').clone();
	var img			= null;
	var rendered	= false;
	var state		= 'closed';
	
	this.tweet		= null;
	this.open 	 	= open;
	//Log('retweet modal instance: '+this.prototype);
	
	decorateCloseBtn( element );
	
	function decorateCloseBtn( e )
	{

		var cBtn = e.find('.close-button');
		Log('finding close btn: '+e.find('.close-button').text());
		cBtn.click(onClose);
		cBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
	}
	
	
	function open( tweet )
	{
		if( tweet ) setContent( tweet );
		
		Log('opening retweet');
		if( state == 'closed') 
		{
			element.fadeIn(250);
			Modal.constructor.overlay.fadeIn(250);
		}
		
		state = 'open';
	}
	
	
	function onClose()
	{
		Modal.constructor.modal.fadeOut(250);
		Modal.constructor.overlay.fadeOut(250);
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
	
	function onImageLoad(i)
	{		
		var padding = 15;
		element.find('img').hide();
		element.find('img').attr( 'src', this.src );
		element.find('img').attr( 'width', this.width );
		element.find('img').attr( 'height', this.height );
		element.find('img').fadeIn('slow');
		
    	var docY = ($(window).height() / 2) - 100;
    	var docX = $(document).width() / 2;	
		var height = element.height() / 2;
		var width = img.width / 2;
		var top = (docY - height < 0) ? 10 : docY - height;
		var left = docX - width;
		
		var propObject = {};
		propObject.width = img.width;
		propObject.left = left;
		propObject.top = top;
		element.animate(propObject, 250);
	}

	
	function initPosition()
	{
		element.css('position', 'fixed');
		element.css('top', top );
		element.css('left', left );
		element.css('z-index', ++Modal.constructor.z)
	}
	
	return this;
};
