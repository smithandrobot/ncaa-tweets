// static singleton

TweetParser = (function TweetParser()
 {
    var httpReg = /(http|https|ftp)([^ ]+)/gi;
    var userNameReg = /(^|)@(\w+)/g;
    var hashReg = /(^|)#(\w+)/g;

	this.parse = parse;
	this.swapHash = swapHash;
	this.parseUser = parseUser;
	
	function swapHash(s)
	{
		s.replace("#", "%23");
		return s;
	}
	
	
	function parse(str)
    {
        var tweet = str;
        tweet = parseLinks(tweet);
        tweet = parseHashtags(tweet);
        //
		tweet = parseUser(tweet);

        return tweet;
    }


    function parseHashtags(str)
    {
        var hashArray = str.match(hashReg);
		if(hashArray == null) return str;
		var total = hashArray.length - 1;
		
        for (var i = 0; i<= total; i++)
        {
            replaceString = "<a href='http://search.twitter.com/search?q=" + hashArray[i].replace("#", "%23") + "' target='_blank'>" + hashArray[i] + "</a>";
            str = str.replace(hashArray[i], replaceString);
        }

        return str;
    }


    function parseUser(str)
    {
        var userArray = str.match(userNameReg);
		if(userArray == null) return str;
		
		var total = userArray.length - 1;

        for (var i = 0; i <= total; i++)
        {
            replaceString = "<a href='http://twitter.com/" + userArray[i] + "' target='_blank'>" + userArray[i] + "</a>";
            str = str.replace(userArray[i], replaceString);
        }

        return str;
    }


    function parseLinks(str)
    {
        var linkArray = str.match(httpReg);
		if(linkArray == null) return str;
		var total = linkArray.length - 1;
        var replString;

        for (var i = 0; i<= total; i++)
        {
            replaceString = "<a href='" + linkArray[i] + "' target='_blank' rel='nofollow' class='twitter-timeline-link'>" + linkArray[i] + "</a>";
            str = str.replace(linkArray[i], replaceString);
        }

        return str;
    }
	
	return this;
})();