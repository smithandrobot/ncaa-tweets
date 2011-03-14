// inherits from
VerizonModule.prototype = new EventDispatcher();
VerizonModule.constructor = VerizonModule;

function VerizonModule() 
{

	/* PRIVATE */
	var UPDATE			= 1000;
	var element 		= $('#atanywhere-container');
	var self 			= this;
	var model 			= new TRModel();
	var questionModel 	= new TRModel();
	var questionSinceID = null;
	var sinceID			= null;
	var feedServer 		= 'http://tweetriver.com/mr_mm_2011/';
	var tweet			= null;
	var qInterval		= null;
	var tInterval		= null;
	/* PUBLIC */

	this.twitterProxy 	  = null;
	this.twitterReady  	  = twitterReady;
	this.getElement		  = function () { return element.find('.tweet-text'); };
	/* INITIALIZE */
	
	model.addEventListener('onDataChange', onDataChange);
	Log(feedServer + 'mm-2011-verizon.json')
	model.setStream( feedServer + 'mm-2011-verizon.json' );
	model.load();
	
	questionModel.addEventListener('onDataChange', onQuestionData);
	questionModel.setStream( feedServer + 'mm-2011-verizon-questions.json' );
	questionModel.load();
	

	function twitterReady( )
	{
		makeTweetBox();
	}
	
	
	function onDataChange( e )
	{
		var data = e.target.getData();
		
		if(data.length <= 0) 
		{
			element.find('.tweet-text').html('<p>Loading Verizon Tweets...</p>');
			return;
		}
		
		setData(data[0])
	}
	
	
	function onQuestionData( e )
	{
		var data = e.target.getData();
		var label = $("#tbox iframe").contents().find("label");
		
		label.text(data[0].text);
		clearInterval(qInterval);
		qInterval = setTimeout(questionModel.load, UPDATE)
	}
	
	
	function setData(d)
	{
		self.tweetText	= d.text;
		self.htmlText 	= TweetParser.parse(d.text);
		self.tweetID 	= d.id_str;
		self.screenName	= d.user.screen_name;
		self.userName 	= d.user.name;
		
		element.find('.tweet-text').html(self.htmlText);
		decorate( element );
	};

	
	function makeTweetBox()
	{
		var tObj =	{ height: 90,
					  width: 340,
					  defaultContent: "#ncaatourney http://es.pn/eCYCAh",
					  label: "Add your own Tournament Tweet.",
					  complete: updateTweetBox
				    };

		self.twitterProxy.getTweetBox('#tbox', tObj);
	}
	
	
	function updateTweetBox()
	{
		styleTweetBox();
	}
	
	function onClickReply()
	{
		dispatchEvent('onReply', self);
	}
	
	
	function onClickFollow()
	{
		dispatchEvent('onFollow', self);
	}	
	
	
	function onClickReTweet()
	{
		dispatchEvent('onReTweet', self);
	}
	
	
	function onClickFavorite()
	{
		dispatchEvent('onFavorite', self);
	}
	
	
	function decorate(e)
	{			
		e.find('.action-follow').click(onClickFollow);
		e.find('.action-favorite').click(onClickFavorite);
		e.find('.action-retweet').click(onClickReTweet);
		e.find('.action-reply').click(onClickReply);
	}

	function styleTweetBox()
	{
		var box = $("#tbox iframe").contents().find("textarea");
		var iframe = $("#tbox iframe");
		var button = iframe.contents().find("button").parent();
		var formButton = iframe.contents().find("button");
		populateTweetBox();
		label = iframe.contents().find("label");
		counter = iframe.contents().find("#counter");
		var fontSize = label.css('fontSize');	
		label.css('font-size', 12);
		label.css('color', "#fff");
		
		iframe.css('height', '180');
		// iframe.css('border', '1px red solid');
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
		
		box.focus(function() {
			Log('focus')
			setSelectionRange(this, 0, 0)
			return;
		});
		
		box.blur(function() {
			Log('blur')
			box.click(function() 
			{
				setSelectionRange(this, 0, 0);
				box.unbind('click');
			});
			return;
		});
		
		box.click(function() 
		{
			setSelectionRange(this, 0, 0);
			box.unbind('click');
		});
		
	}


	function setCarotPos()
	{
		var box = $("#tbox iframe").contents().find("textarea");
		setSelectionRange(box, 0 , 0 );
	}
	
	
	function populateTweetBox()
	{
		var textarea = $("#tbox iframe").contents().find("textarea");
		textarea.val('#ncaatourney http://es.pn/eCYCAh');
	}
	
	function setSelectionRange(input, selectionStart, selectionEnd) {
		if (input.setSelectionRange) {
			input.focus();
			input.setSelectionRange(selectionStart, selectionEnd);
		}
		else if (input.createTextRange) {
			var range = input.createTextRange();
			range.collapse(true);
			range.moveEnd('character', selectionEnd);
			range.moveStart('character', selectionStart);
			range.select();
		}
	}
	
	return this;
};
