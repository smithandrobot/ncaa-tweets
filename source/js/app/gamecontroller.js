GameController.prototype = new EventDispatcher();
GameController.constructor = GameController;
function GameController(gameData) 
{
    var self          = this;
    var selected      = null;
    var id            = null;
    var view          = null;
    var visitorScore  = 0;
    var homeScore     = 0;
    var period        = null;
    
    self.update = update
    init(gameData);
    
    function init(data){
        
        self.id = data.gameid
        var viewData = sanitizeData(data)
        self.view = createView(viewData)
	    self.view.appendTo("#schedule-container");
    }
    
    function createView(viewData){
         var template = $("#gameTemplate").tmpl(viewData);
         template.css('opacity', 0);
         template.animate({opacity:1}, { duration:500, complete: function(){ $(this).css('filter', '');} });
         self.visitorScore = template.find('.team-visiting .team-score')
         self.homeScore = template.find('.team-home .team-score')
         self.period = template.find('.game-period')
         template.find('.home-tweet-cta').click({'teamId':viewData.homeTeam},teamClick)
    	 template.find('.visiting-tweet-cta').click({'teamId':viewData.visitingTeam},teamClick)
    	 return template
    }
    
    function update(data){
        var viewData = sanitizeData(data)
        self.visitorScore.text(viewData.visitingTeam.score)
        self.homeScore.text(viewData.homeTeam.score)
        self.period.text(viewData.game.period)
        self.view.data(viewData)
        
        if(viewData.game.status == "final"){
            self.view.addClass('game-final')
        }
        
    }
    
    function sanitizeData(data){
        var templateData = {'game':{'gameid':data.gameid}}
        
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
	    
	    self.templateData = templateData 
	    return templateData
    }
    
    function teamClick(obj){
	    self.selected = obj.data.teamId
	    dispatchEvent("onTeamSelect", self);
	}
	
    return self;
}