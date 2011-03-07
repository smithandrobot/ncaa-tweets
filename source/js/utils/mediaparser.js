MediaParser.prototype = new EventDispatcher();
MediaParser.constructor = MediaParser;

function MediaParser()
{	

	var optionalProtocol = /(?:(?:https?\:\/\/)?(?:www\.)?)/;
	var imgID = 0;
	var self = this;
	this.getImage = getImage;
	this.thumb;
	this.largeImage;
	this.source;
	this.link;
	
	domains = new Array(
		{domain:/\b(?:(?:https?\:\/\/)?(?:www\.)?)?yfrog\.com\/(\S+)/, process:yFrog},
		{domain:/\b(?:(?:https?\:\/\/)?(?:www\.)?)?(?:www\.)?twitpic\.com\/(\S+)/, process:twitpic},
		{domain:/\b(?:(?:https?\:\/\/)?(?:www\.)?)?(?:www\.)?tweetphoto\.com\/(\d+)/i, process:plixi},
		{domain:/\b(?:(?:https?\:\/\/)?(?:www\.)?)?(?:www\.)?plixi\.com\/p\/(\d+)/i, process:plixi},
		{domain:/\b(?:(?:https?\:\/\/)?(?:www\.)?)?(?:www\.)?m\.plixi\.com\/p\/(\d+)/i, process:plixi},
		{domain:/\b(?:(?:https?\:\/\/)?(?:www\.)?)?(?:www\.)?photozou\.(?:com|jp)\/photo\/show\/\d+\/(\d+)/i, process:photozou},
  		{domain:/\b(?:(?:https?\:\/\/)?(?:www\.)?)?(?:www\.)?flic\.kr\/p\/[a-z0-9]+\/?$/i, process:flickr},
        {domain:/\b(?:(?:https?\:\/\/)?(?:www\.)?)?(?:www\.)?flic\.kr\/(?!p\/)([\w\@\-]+)\/?$/i, process:flickr}
		);
	
	function getImage( t )
	{
		var slug;
		var imgData;
		
		for(var i in domains)
		{
			slug = t.match(domains[i].domain);
			if(slug) imgData = domains[i].process(slug[0], slug[1]);
		}
	};
	
	
	function plixi( url, id )
	{
		var domID = 'media_'+imgID;
		var thumb = 'http://api.plixi.com/api/tpapi.svc/json/imagefromurl?size=thumbnail&url=http://tweetphoto.com/'+id;
		var large = 'http://api.plixi.com/api/tpapi.svc/json/imagefromurl?size=large&url=http://tweetphoto.com/'+id;
		self.thumb = thumb;
		self.largeImage = large;
		self.source = (url.indexOf('tweetphoto') != -1) ? 'tweetphoto' : 'twitpic';
		
		dispatchEvent('onImageData', self);

	};
	
	
	function yFrog( url, id )
	{
		var thumb = "http://yfrog.com/"+id+":small";
		var large = "http://yfrog.com/"+id+":iphone";
		self.thumb = thumb;
		self.largeImage = large;
		self.source = 'yFrog';
		
		dispatchEvent('onImageData', self);
	};
	
	
	function twitpic( url, id )
	{
		var thumb = "http://twitpic.com/show/mini/"+id;
		var large = "http://twitpic.com/show/large/"+id;
		self.thumb = thumb;
		self.largeImage = large;
		self.source = 'twitpic';
		
		dispatchEvent('onImageData', self);
	};
	
	
	function photozou( url, id )
	{
		var thumb = "http://photozou.jp/p/img/"+id;
		var large = "http://photozou.jp/p/img/"+id;
		self.thumb = thumb;
		self.largeImage = large;
		self.source = 'photozou';
		
		dispatchEvent('onImageData', self);
	};
	
	
	function flickr( url, id )
	{
		key 		= "a99190c3186dafc012543e6e048865f3";
		secret 		= "6899beb0fb0c5513";
		var fid 	= url.split("http://flic.kr/p/")[1];
		id 			= base58_decode(fid);
		var apiURL 	= "http://api.flickr.com/services/rest/";
		
		$.ajax({ 
			url: apiURL, 
			dataType: 'jsonp',
			data : 'method=flickr.photos.getInfo&api_key='+key+'&photo_id='+id+'&format=json&jsoncallback=?',
			success: onFlickrImgURL, 
			error: function(){Log('error conencting to twitter')} 
			});	

		self.thumb = "http://flic.kr/p/img/"+fid+"_s.jpg";
		self.source = 'flickr';
	};
	
	
	function onFlickrImgURL( d )
	{
		var url = "http://farm"+d.photo.farm+".static.flickr.com/"+d.photo.server+"/"+d.photo.id+"_"+d.photo.secret+"_z.jpg";
		self.largeImage = url;
		dispatchEvent('onImageData', self);
	};
	
	
	function base58_decode( id )
	{
	    var alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ' ;
	    var num = id.length ;
	    var decoded = 0 ;
	    var multi = 1 ;
	    for ( var i = (num-1) ; i >= 0 ; i-- )
	    {
	        decoded = decoded + multi * alphabet.indexOf( id[i] ) ;
	        multi = multi * alphabet.length ;
	    }
	    return decoded;
	};
	
	return this;
}