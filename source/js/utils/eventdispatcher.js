function EventDispatcher()
{
	var e = EventManager;
	this.addEventListener = addEventListener;
	this.dispatchEvent = dispatchEvent;
	
	function addEventListener(eventName, func)
	{
 		e.addEvent(eventName, addEventListener.caller, this, func); 
	}
	
	function dispatchEvent(type, target)
	{
		// Log('dispatchEvent '+type);
		e.dispatchEvent(type, target) 
	}
}