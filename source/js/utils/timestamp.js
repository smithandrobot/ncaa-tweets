TimeStamp = (
function TimeStamp() 
{
	var DAY			= 1000*60*60*24;
	var HOUR		= 1000*60*60;
	var MIN			= 1000*60;
			
	this.timeSince 	= timeSince;
	
	function timeSince(Str)
	{
		
	}
	
	function convertUTCString( s )
	{
		var s1 = s.split(' ');
		var s2 = String(s1[0]+' '+s1[1]+' '+s1[2]+' '+s1[5]+' '+s1[3]+' '+s1[4]);
		return s2
	}
		
	function timeSince( timestamp )
	{
		var t2 			= convertUTCString( timestamp );		
		var tweetTime	= new Date(t2);
		var now			= new Date()
		var diff 		= now.getTime() - tweetTime.getTime();
		var diffDays	= Math.floor(diff/DAY);
		var diffHours	= Math.floor(diff/HOUR);
		var diffMins	= Math.floor(diff/MIN);
		var diffSecs	= Math.floor(diff/1000);
		
		var sinceHours 	= diffHours-(diffDays*24);
		var sinceMins  	= diffMins-(diffHours*60);
		var sinceSecs  	= diffSecs-(diffMins*60);
		
		return {days: diffDays, hours: sinceHours, minutes:sinceMins, seconds:sinceSecs};
	}
		
	return this;
	
}
)();