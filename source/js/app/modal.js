// inherits from
Modal.prototype = new EventDispatcher();
Modal.constructor = Modal;
Modal.constructor.overlay = null;
Modal.constructor.z = 5000;

function Modal() 
{
	
	// if(Modal.constructor.overlay == null) makeOverlay();
	
	this.onClose = onClose;
	this.decorateCloseBtn = decorateCloseBtn;
	Log('decorateCloseBtn defined as '+this.decorateCloseBtn);
	
	function onClose()
	{
		Modal.constructor.modal.fadeOut(250);
		Modal.constructor.overlay.fadeOut(250);
	}
	
	
	function decorateCloseBtn( e )
	{
		Log('finding close btn');
		var cBtn = $(e).find('.close-botton');
		cBtn.click(onClose);
		cBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
	}
	
	
	function makeOverlay()
	{
		Modal.constructor.overlay = $('<div id="tweet-photo-overlay">');
		var cssObj = {};
		cssObj.position 	   	= 'absolute';
		cssObj.top 			   	= 0//$(document).scrollTop();
		cssObj.left 		   	=  0;
		cssObj.height 		   	= $(document).height();
		cssObj.width 		   	= '100%';
		cssObj.opacity 		   	=  0.8;
		cssObj.backgroundColor 	= 'black';
		cssObj.zIndex 			=  5000;

		Modal.constructor.overlay.css(cssObj);
		Modal.constructor.overlay.appendTo(document.body);
		Modal.constructor.overlay.click(onClose);
	}
	
	return this;
};
