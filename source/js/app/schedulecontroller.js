// inherits from
ScheduleController.prototype = new EventDispatcher();
ScheduleController.constructor = ScheduleController;
function ScheduleController() 
{
    var model 		= new TRModel();
    var feedURL  = 'mock/schedule.json'
    
    model.addEventListener('onDataChange', onDataChange);
    loadFeed();
    
    function onDataChange( e )
	{
		Log('New Data');
	}
	
	function loadFeed(  )
	{
		model.setStream( feedURL );
		model.load();
	}
    
	return this;
};
