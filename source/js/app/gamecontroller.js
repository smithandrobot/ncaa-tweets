GameController.prototype = new EventDispatcher();
GameController.constructor = GameController;
function GameController(gameData, model)
 {
    var self = this;
    var selected = null;
    var id = null;
    var view = null;
    var visitorScore = 0;
    var homeScore = 0;
    var period = null;
    var hashTag = null;
    var active = false;
    var teams = null;

    self.update = update
    self.setTeamModel = setTeamModel;
    init(gameData, model);

    function init(data, model) {

        self.id = data.id
        self.teams = model
        var viewData = sanitizeData(data)
        self.view = createView(viewData)
        self.view.appendTo("#schedule-container");
    }
    
    function setTeamModel(model){
        self.teams = model
    }
    
    function createView(viewData) {
        var template = $("#gameTemplate").tmpl(viewData);
        template.css('opacity', 0);
        template.animate({
            opacity: 1
        },
        {
            duration: 500,
            complete: function() {
                $(this).css('filter', '');
            }
        });
        
        self.visitorScore = template.find('.team-visiting .team-score')
        self.homeScore = template.find('.team-home .team-score')
        self.period = template.find('.game-period')
        template.find('.home-tweet-cta').click({
            'teamId': viewData.homeTeam
        },
        teamClick)
        template.find('.visiting-tweet-cta').click({
            'teamId': viewData.visitingTeam
        },
        teamClick)
        template.find('.hashtag').click(hashTagClick)
        return template
    }

    function update(data) {
        var viewData = sanitizeData(data)
        self.visitorScore.text(viewData.visitingTeam.score)
        self.homeScore.text(viewData.homeTeam.score)
        self.period.text(viewData.game.period)
        self.view.data(viewData)

        if (viewData.game.status == "final") {
            self.view.addClass('game-final')
        }

    }

    function sanitizeData(data) {
        
        var templateData = {
            'game': {
                'id': data.id
            }
        }

        templateData.date = Date.parse(data.date)
        
        for (cid in data.competitor) {
            var c = data.competitor[cid]

            if (c.homeaway == "home") {
                templateData.homeTeam = c
            } else {
                templateData.visitingTeam = c
            }
            //c.customData = Teams.getTeam(c.id)
            c.customData = self.teams.getTeam(c.shortName)
            //Log(c.customData)
            if(c.customData == undefined){
                c.customData = {}
                c.customData.hashTag = "#team"
                c.name = c.shortName
            } else {
                c.name = c.customData.displayName
            }
            
        }
        
        if (data.eventstatus.status == "FINAL") {
            templateData.game.status = "final"
            templateData.game.period = "final"
            self.active = false
        } else if (data.eventstatus.status == "SCHEDULED") {
            templateData.game.status = "current"
            templateData.game.period = templateData.date.toString("M/d");
            self.active = false
        } else if (data.eventstatus.status == "INTERMISSION") {
            templateData.game.status = "current"
            templateData.game.period = "Half"
            self.active = true
        } else {
            templateData.game.status = "current"
            templateData.game.period = Utils.ordinal(data.eventstatus.curPeriod)
            self.active = true
        }


        self.templateData = templateData
        return templateData
    }

    function teamClick(obj) {
        self.selected = obj.data.teamId
        dispatchEvent("onTeamSelect", self);
    }

    function hashTagClick(obj) {
        self.hashTag = $(this).text();
        dispatchEvent("onHashTagClick", self);
        return false;
    }

    return self;
}