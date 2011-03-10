GameController.prototype = new EventDispatcher();
GameController.constructor = GameController;
function GameController(gameData) 
{
    var self      = this;
    var selected  = null;
    
    init(gameData);
    
    function init(data){
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
	    
	    var template = $("#gameTemplate").tmpl(templateData);
	    
	    var cta = template.find('.home-tweet-cta').click({'teamId':templateData.homeTeam},teamClick)
	    var cta = template.find('.visiting-tweet-cta').click({'teamId':templateData.visitingTeam},teamClick)
	    
	    template.appendTo("#schedule-container");
    }
    
    function teamClick(obj){
	    self.selected = obj.data.teamId
	    dispatchEvent("onTeamSelect", self);
	}
	
    return self;
}