function EventDispatcher()
{
	var e = EventManager;
	this.addEventListener = addEventListener;
	this.removeEventListener = removeEventListener;
	this.dispatchEvent = dispatchEvent;
	
	function addEventListener(eventName, func)
	{
 		e.addEvent(eventName, addEventListener.caller, this, func); 
	}
	
	function removeEventListener(eventType, observer)
	{
 		e.removeEventListener(eventType, observer); 
	}
	
	function dispatchEvent(type, target)
	{
		// Log('dispatchEvent '+type);
		e.dispatchEvent(type, target) 
	}
}