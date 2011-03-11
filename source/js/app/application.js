$(document).ready(function() {
	var a = new Application();
});

function Application()
{
	var server 		    = 'http://tr-cache-2.appspot.com/massrelevance/';
	var schedules 		= new ScheduleController();
	var tweetlist 		= new TweetListController();

	var tweetBox		= $('#tbox');
	
	this.toString	   	= toString;
	
	schedules.addEventListener('onTeamSelect', teamClick)
	function onScheduleChange( e )
	{

	};
	
	function teamClick(e){
	    Log(e.target.selected)
	}

	
	function toString() { return "Application"; };
};