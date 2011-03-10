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
		$(data).each(function(){
		    renderScore($(this)[0])
		})
		
	}
	
	function renderScore(data){
	    Log(data);
	    
	    var templateData = {game:{}}
	    
	    if(data.competitors[0].homeaway == "home"){
	        templateData.homeTeam = data.competitors[0]
	        templateData.visitingTeam = data.competitors[1]
	    } else {
	        templateData.homeTeam = data.competitors[1]
	        templateData.visitingTeam = data.competitors[0]
	    }
	    
	    if(data.eventStatus.status == "FINAL"){
	        templateData.game.status = "final"
	        templateData.game.period = "final"
	    } else {
	        templateData.game.status = "current"
	        templateData.game.period = Utils.ordinal(data.eventStatus.curPeriod)
	    }
	    
	    $("#gameTemplate").tmpl(templateData).appendTo("#schedule-container");
	}
	function loadFeed(  )
	{
		model.setStream( feedURL );
		model.loadJSON();
	}
    
	return this;
};
