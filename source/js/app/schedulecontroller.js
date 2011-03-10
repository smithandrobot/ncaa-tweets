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
	    
	    for(cid in data.competitors){
	        var c = data.competitors[cid]
	        
	        if(c.homeaway == "home"){
	            templateData.homeTeam = c
	        } else {
	            templateData.visitingTeam = c
	        }
	        c.customData = Teams.getTeam(c.id)
	        if(c.name.length > 22){
                c.name = c.shortName
            }
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
