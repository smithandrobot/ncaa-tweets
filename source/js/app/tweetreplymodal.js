// inherits from
TweetReplyModal.prototype = new Modal();
TweetReplyModal.constructor = TweetPhotoModal;

function TweetReplyModal() 
{
	var element 	= null;
	var modal;
	var self		= this;
	var img			= null;
	var rendered	= false;
	
	this.tweet		= null;
	this.open 	 	= open;
	this.setModal	= setModal;
	
	function open()
	{
		if(!element) element = $('#modal-photo-template').clone();
		getPhotoContent();
	}
	
	
	function setModal( e )
	{

	}
	
	function getPhotoContent()
	{	
		if(TweetPhotoModal.constructor.overlay == null) makeOverlay();
		TweetPhotoModal.constructor.overlay.fadeIn(250);
		TweetPhotoModal.constructor.modal = element;
		
		if(rendered)
		{
			element.fadeIn(250);
			return;
		}
		
		img			= new Image();
		img.onload 	= onImageLoad;
		img.src 	= self.tweet.img;
		
		element.find('.photo-screen-name').text('@'+self.tweet.screenName);
		element.find('.photo-user-name').text(self.tweet.userName);
		element.find('.photo-tweet-body').html( self.tweet.tweetText);
		element.find('.photo-tweet-time').text( self.tweet.time );
		element.find('img').attr( 'src', './img/ajax-loader.gif' );
		
		element.css('width', 200);
		decorateCloseBtn(element);
		element.appendTo(document.body);
		
    	var docY = ($(window).height() / 2) - 100;
    	var docX = $(document).width() / 2;
		var top = docY - (element.height() / 2);
		var left = docX - 100;
		
		element.css('position', 'fixed');
		element.css('top', top );
		element.css('left', left );
		element.css('z-index', ++TweetPhotoModal.constructor.z)

		rendered = true;
		return element;
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
	
	
	function onClose()
	{
		TweetPhotoModal.constructor.modal.fadeOut(250);
		TweetPhotoModal.constructor.overlay.fadeOut(250);
	}
	
	function decorateCloseBtn( e )
	{
		var cBtn = $(e).find('.close-botton');
		cBtn.click(onClose);
		cBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
	}
	
	function makeOverlay()
	{
		TweetPhotoModal.constructor.overlay = $('<div id="tweet-photo-overlay">');
		var cssObj = {};
		cssObj.position = 'absolute';
		cssObj.top = 0//$(document).scrollTop();
		cssObj.left =  0;
		cssObj.height = $(document).height();
		cssObj.width = '100%';
		cssObj.opacity =  0.8;
		cssObj.backgroundColor =  'black';
		cssObj.zIndex =  5000;

		TweetPhotoModal.constructor.overlay.css(cssObj);
		TweetPhotoModal.constructor.overlay.appendTo(document.body);
		TweetPhotoModal.constructor.overlay.click(onClose);
	}
	
	
	return this;
};
