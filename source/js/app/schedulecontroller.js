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
		var data = e.target.getData()
		Log(data[0].competitors[0]);
		
		$("#gameTemplate").tmpl({'visitor':data[0].competitors[0]}).appendTo("#schedule-container");
	}
	
	function loadFeed(  )
	{
		model.setStream( feedURL );
		model.loadJSON();
	}
    
	return this;
};
