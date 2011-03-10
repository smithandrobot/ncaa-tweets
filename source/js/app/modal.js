// inherits from
Modal.prototype = new EventDispatcher();
Modal.constructor = Modal;
Modal.constructor.overlay = null;
Modal.constructor.z = 5000;
// Modal.constructor.modal = null;

function Modal() 
{
	
	if(TweetPhotoModal.constructor.overlay == null) makeOverlay();
	
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
		Modal.constructor.overlay = $('<div id="tweet-photo-overlay">');
		var cssObj = {};
		cssObj.position = 'absolute';
		cssObj.top = 0//$(document).scrollTop();
		cssObj.left =  0;
		cssObj.height = $(document).height();
		cssObj.width = '100%';
		cssObj.opacity =  0.8;
		cssObj.backgroundColor =  'black';
		cssObj.zIndex =  5000;

		Modal.constructor.overlay.css(cssObj);
		Modal.constructor.overlay.appendTo(document.body);
		Modal.constructor.overlay.click(onClose);
	}
	
	return this;
};
