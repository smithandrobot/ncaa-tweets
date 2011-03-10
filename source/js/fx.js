

function styleTweetBox()
{
	Log('styleTweetBox');
	var box = $("#tbox iframe").contents().find("textarea");

	var button = $("#tbox iframe").contents().find("button").parent();
	var formButton = $("#tbox iframe").contents().find("button");
	populateTweetBox();
	label = $("#tbox iframe").contents().find("label");
	counter = $("#tbox iframe").contents().find("#counter");
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
	// button.removeClass('btn-m');
	//button.addClass('tweetBoxCustomButton');
	
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
	textarea.val('#oscars  http://eonli.ne/rcoscars');
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
