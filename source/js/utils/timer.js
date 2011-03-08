// inherits from
Timer.prototype = new EventDispatcher();
Timer.constructor = Timer;

function Timer(delay, repeat) 
{
	var intervalID;
	var repeatCount 	= repeat;
	var self 	    	= this;
	
	this.start			= start;
	this.stop			= stop;
	this.reset			= reset;
	this.currentCount	= 0;
	this.delay			= delay;
	
	function start()
	{
		intervalID = setInterval(update, self.delay);
	}
	
	
	function stop()
	{
		clearInterval(intervalID);
	}
	
	
	function reset()
	{
		clearInterval(intervalID);
		self.currentCount = 0;
	}
	
	
	function update()
	{
		++self.currentCount;
		
		if(self.currentCount == repeatCount && repeatCount != 0)
		{
			clearInterval(intervalID);
			dispatchEvent('timer', self);
			dispatchEvent('timerComplete', self);
		}else{
			dispatchEvent('timer', self);
		}
	}
	
	
	return this;
};
