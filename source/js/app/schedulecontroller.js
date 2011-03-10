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
	    var data = e.target.getData()
	    
	    if(games.length == 0){
	        $("#schedule-container").empty();
    		
    		$(data).each(function(){
    		    renderGame($(this)[0])
    		})
	    } else {
	        $(data).each(function(){
    		    updateGame($(this)[0])
    		})
	    }
	    
	}
	
	function renderGame(data){
	    var game = new GameController(data);
	    games.push(game)
	    game.addEventListener("onTeamSelect", teamClick)
	    
	}
	
	function updateGame(data){
	    for(game in games){
	        if(games[game].id == data.gameid){
	            games[game].update(data)
	        }
	    }
	    
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
