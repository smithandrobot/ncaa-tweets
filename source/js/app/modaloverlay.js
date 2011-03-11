// inherits from
ModalOverlay.prototype = new EventDispatcher();
ModalOverlay.constructor = ModalOverlay;

function ModalOverlay() 
{
	this.z 		= 5000;
	this.close 	= close;
	this.open   = open;
	var self		= this;
	var state		= 'closed';
	var rendered    = false;
	var overlay		= null;
	
	makeOverlay();
	
	function close()
	{
		if(state == 'closed') return;
		overlay.fadeOut(250)
		state = 'closed';
		dispatchEvent('onModalOverlayClose', self);
	};
	
	
	function open()
	{
		if(state == 'open') return;
		if(!rendered)
		{
			overlay.appendTo(document.body);
			rendered = true;
		}
		overlay.fadeIn(250)
		state = 'open';
	};
	
	
	function makeOverlay()
	{
		overlay = $('<div id="modal-overlay">');
		var cssObj = {};
		cssObj.position 	   	= 'absolute';
		cssObj.top 			   	= 0//$(document).scrollTop();
		cssObj.left 		   	=  0;
		cssObj.height 		   	= $(document).height();
		cssObj.width 		   	= '100%';
		cssObj.opacity 		   	=  .5;
		cssObj.backgroundColor 	= 'black';
		cssObj.zIndex 			=  self.z;

		overlay.css(cssObj);
		overlay.click(close);
	};
	
	return this;
};
