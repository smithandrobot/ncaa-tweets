ModalPhoto.prototype = new EventDispatcher();
ModalPhoto.constructor = ModalPhoto;

function ModalPhoto( overlay ) 
{
	var element 	= $('#modal-photo-template');
	var overlay		= overlay;
	var self		= this;
	var img			= null;
	var rendered	= false;
	var state		= 'closed';
	this.open 	 	= open;

	overlay.addEventListener('onModalOverlayClose', onClose);
	decorateCloseBtn();
	initCSS();
	
	function open( t )
	{
		if( state == 'open') return;
		overlay.open();
		getPhotoContent( t );
	}


	function onClose()
	{
		element.fadeOut(250);
		overlay.close();
		state = 'closed';
	}
	
	
	function getPhotoContent( t )
	{	
		
		var img		= new Image();
		img.onload 	= onImageLoad;
		img.src 	= t.largeImage;
		
		element.css('width', 200);
		
    	var docY = ($(window).height() / 2) - 100;
    	var docX = $(document).width() / 2;
		var top = docY - (element.height() / 2);
		var left = docX - 100;
		
		element.css('top', top );
		element.css('left', left );
		element.css('z-index', 5002);
		
		element.find('img').attr( 'width', 31 );
		element.find('img').attr( 'height', 31 );
		element.find('img').attr( 'src', 'img/ajax-loader.gif');
		
		element.show();
	}
	
	
	function onImageLoad(i)
	{			
		var img = element.find('img');
		img.hide();
		img.attr( 'src', this.src );
		img.attr( 'width', this.width );
		img.attr( 'height', this.height );
		img.fadeIn('slow');
		
    	var docY = ($(window).height() / 2) - 100;
    	var docX = $(document).width() / 2;	
		var height = element.height() / 2;
		var width = this.width / 2;
		var top = (docY - height < 0) ? 10 : docY - height;
		var left = docX - width;
		
		var propObject = {};
		propObject.width = this.width;
		propObject.left = left;
		propObject.top = top;
		
		element.animate(propObject, 250);
	}

	
	function decorateCloseBtn()
	{
		var cBtn = element.find('.close-button');
		cBtn.click(onClose);
		cBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
	}
	
	
	function initCSS()
	{
		// element.css('position', 'absolute');
		element.css('position', 'fixed');
	}
	
	
	return this;
};
