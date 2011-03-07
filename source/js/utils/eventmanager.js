// static singleton
EventManager = (function ()
{
    this.events = new Array();

	this.addEvent = function(eventType, observer, broadcaster, method)
	{ 
		this.events.push({observer:observer, method : method, broadcaster: broadcaster, eventType:eventType});
	};


	this.dispatchEvent = function(eventType, target)
	{
    	for(var i in this.events)
		{
    	    var eType = this.events[i].eventType;
    	    var observer =  this.events[i].observer;
			var method	= this.events[i].method;
			b = this.events[i].broadcaster;
			if(eType == eventType && target == b) 
			{
				method.call(observer, new Event(eType, target));
				return true;
			};
    	};
	};

	this.removeEventListener = function (eventType, observer)
	{
		var e;
		var o;
		
	    for(var i in this.events)
		{
			e = this.events[i].eventType;
			o =  this.events[i].observer;
			
			if(e == eventType && observer == o) this.events.splice(i,1);
	    }
		
	};
	
	return this;
})();