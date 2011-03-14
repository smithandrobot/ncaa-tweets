ModalTweetBox.prototype = new EventDispatcher();
ModalTweetBox.constructor = ModalTweetBox;

function ModalTweetBox( overlay ) 
{
	var element 		= $('#modal-tweetbox-template');
	var overlay			= overlay;
	var img				= null;
	var rendered		= false;
	var state			= 'closed';
	var self			= this;
	                	
	this.tweet			= null;
	this.open 	 		= open;
	this.twitterProxy 	= null;
	
	overlay.addEventListener('onModalOverlayClose', onClose)
	decorateBTNS();
	initCSS();
	
	
	function open( h )
	{
		if( h ) setContent( h );
		
		if( state == 'closed') 
		{
			$('#team-tweet-box').empty();
			writeTweetBox( h );
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
		element.find('.confirmation').html('Your tweet for '+t+'<br />was sent to twitter.')
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
		
		var okBtn = element.find('.modal-confirm-button');
		okBtn.click(onClose);
		okBtn.hover(function() {$(this).css('cursor','pointer')}, function() {$(this).css('cursor','auto')} );
		
	}
	
	function showConfirmScreen()
	{
		var cs = element.find('.confirmation-screen');
		var as = element.find('.action-screen');
		var es = element.find('.error-screen');
		
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
	
	
	function initCSS()
	{
		element.css('position', 'fixed');
		position( false );
	}
	
	
	function writeTweetBox( h )
	{
		
		var tObj =	{
 			    		height: 70,
 			    		width: 230,
 			    		defaultContent: h,
 						complete: styleTweetBox,
 			    		label: "",
						onTweet : showConfirmScreen
 			  		};

		self.twitterProxy.getTweetBox('#team-tweet-box', tObj);
	}
	
	
	function styleTweetBox()
	{
		Log('styling modal tweetbox');
		var box = $(".action-screen iframe").contents().find("textarea");
		var button = $(".action-screen iframe").contents().find("button").parent();
		var formButton = $(".action-screen iframe").contents().find("button");
		label = $(".action-screen iframe").contents().find("label");
		counter = $(".action-screen iframe").contents().find("#counter");
		var fontSize = label.css('fontSize');	
		label.css('font-size', 12);
		label.css('color', "#fff");
		counter.css('position', 'absolute');
		counter.css('color', "#fff");
		counter.css('left', '260px');
		counter.css('top', '5px');
		counter.css('text-align', 'right');
		counter.css('width', 80);
		counter.css('font-size', 12);
		box.css('background', 'transparent');
		box.css('color', '#fff');
		button.css('background', '#D53D36');
		button.css('border', 'none');
		formButton.css('color', '#000');
		formButton.css('text-shadow', 'none');
		formButton.css('font-size', '12px');
		formButton.css('font-weight', 'bold');
		formButton.css('text-transform', 'uppercase');
	};
	
	return this;
};
