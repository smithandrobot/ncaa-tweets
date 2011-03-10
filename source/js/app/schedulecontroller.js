// inherits from
ScheduleController.prototype = new EventDispatcher();
ScheduleController.constructor = ScheduleController;
function ScheduleController() 
{
    var self            = this;
    var selected        = null;
    var model 		    = new TRModel();
    var feedURL         = 'mock/schedule.json'
    var INTERVAL		= 1000*5;
    var games           = []
    
    model.addEventListener('onDataChange', onDataChange);
    
    loadFeed();
    
    function poll()
	{	
		model.loadJSON();
	}
	
    function onDataChange( e )
	{
	    if(games.length == 0){
	        Log('Rendering Games')
	        $("#schedule-container").empty();
    		var data = e.target.getData()
    		$(data).each(function(){
    		    renderGame($(this)[0])
    		})
	    } else {
	        Log('Scoring Update')
	    }
	    
	}
	
	function renderGame(data){
	    
	    var game = new GameController(data);
	    game.addEventListener("onTeamSelect", teamClick)
	    
	}
	
	function teamClick(obj){
	    self.selected = {'team':obj.target.selected}
	    dispatchEvent("onTeamSelect", self);
	}
	
	
	
	function loadFeed(  )
	{
		model.setStream( feedURL );
		model.loadJSON();
		setInterval(poll, INTERVAL);
	}
    
	return this;
};
