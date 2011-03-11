// inherits from
ScheduleController.prototype = new EventDispatcher();
ScheduleController.constructor = ScheduleController;
function ScheduleController() 
{
    var self            = this;
    var selected        = null;
    var model 		    = new TRModel();
    var feedURL         = null;
    var INTERVAL_TIME	= 1000*5;
    var interval        = null;
    var games           = []
    
    model.addEventListener('onDataChange', onDataChange);
    
    self.loadRound = loadRound;
    
    function loadRound(round){
        Log('Loading round: ' + round)
        games = []
        self.feedURL = 'mock/' + round + '.json';
        removeScrollbar();
        loadFeed();
        $('#scoreboard-loader').show();
    }
    
    function poll()
	{	
		model.loadJSON();
	}
	
    function onDataChange( e )
	{
	    var data = e.target.getData()
	    
	    if(games.length == 0){
	        $('#scoreboard-loader').hide();
    		$(data).each(function(){
    		    renderGame($(this)[0])
    		})
    		addScrollbar()
    		
	    } else {
	        $(data).each(function(){
    		    updateGame($(this)[0])
    		})
	    }
	    
	    clearInterval(self.interval)
	    self.interval = setInterval(poll, INTERVAL_TIME);
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
	    
		model.setStream( self.feedURL );
		model.loadJSON();
		
	}
	
	function addScrollbar(){
	    $('.schedule-scrollbar').scrollbar({handleHeight:151, arrows:false});
	}
	
	function removeScrollbar(){
	    var l = $('#scoreboard-loader').detach();
	    $("#schedule-container").empty();
		$("#schedule_list .scrollbar-pane").remove();
		$("#schedule_list .scrollbar-handle-container").remove();
		$("#schedule_list .scrollbar-handle-up").remove();
		$("#schedule_list .scrollbar-handle-down").remove();
		$("#schedule-container").prepend(l);
	}
    
	return this;
};
