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
    var visitorMentions = null;
    var homeTeam = null;
    var visitingTeam = null;
    var homeMentions = null;
    var period = null;
    var hashTag = null;
    var active = false;
    var teams = null;
    var date = null;

    self.update = update
    self.setTeamModel = setTeamModel;
    init(gameData, model);

    function init(data, model) {

        self.id = data.id
        self.teams = model
        model.addEventListener("onTeamModelReady", onTeamUpdate)
        var viewData = sanitizeData(data)
        self.view = createView(viewData)
        visualizeWL()
        //self.view.appendTo("#schedule-container");
    }

    function setTeamModel(model) {
        self.teams = model
    }

    function onTeamUpdate(e) {
        var h = model.getTeam(self.homeTeam.shortName)
        if (h) {
            self.homeMentions.text(addCommas(h.mentions))
        }
        var v = model.getTeam(self.visitingTeam.shortName)
        if (v) {
            self.visitorMentions.text(addCommas(v.mentions))
        }
        compareMentions()
        visualizeWL()
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
        self.visitorMentions = template.find('.team-visiting .mentions')
        self.homeMentions = template.find('.team-home .mentions')
        self.homeMentions.text(addCommas(self.homeMentions.text()))
        self.visitorMentions.text(addCommas(self.visitorMentions.text()))
        template.find('.home-tweet-cta').click({
            'teamId': viewData.homeTeam
        },
        teamClick)
        template.find('.visiting-tweet-cta').click({
            'teamId': viewData.visitingTeam
        },
        teamClick)
        template.find('.hashtag').click(hashTagClick)
        compareMentions()
        setTips(template, viewData);
        return template
    }

    function visualizeWL() {
        if (self.visitorScore.text() < self.homeScore.text()) {
            self.view.find('.team-home .team-name').addClass('game-losing')
            self.view.find('.team-visiting .team-name').removeClass('game-losing')
            self.view.find('.team-home .team-score').addClass('game-losing')
            self.view.find('.team-visiting .team-score').removeClass('game-losing')
        } else if (self.visitorScore.text() > self.homeScore.text()) {
            self.view.find('.team-home .team-name').removeClass('game-losing')
            self.view.find('.team-visiting .team-name').addClass('game-losing')
            self.view.find('.team-home .team-score').removeClass('game-losing')
            self.view.find('.team-visiting .team-score').addClass('game-losing')
        } else {
            self.view.find('.team-home .team-name').removeClass('game-losing')
            self.view.find('.team-visiting .team-name').removeClass('game-losing')
            self.view.find('.team-home .team-score').removeClass('game-losing')
            self.view.find('.team-visiting .team-score').removeClass('game-losing')
        }
    }

    function compareMentions() {
        if (self.homeTeam.customData.mentions > self.visitingTeam.customData.mentions) {
            self.homeMentions.addClass('team-mentions-large')
            self.homeMentions.removeClass('team-mentions-small')
        } else if (self.homeTeam.customData.mentions < self.visitingTeam.customData.mentions) {
            self.visitorMentions.addClass('team-mentions-large')
            self.visitorMentions.removeClass('team-mentions-small')
        }
    }

    function update(data) {
        var viewData = sanitizeData(data)
        self.visitorScore.text(viewData.visitingTeam.score)
        self.homeScore.text(viewData.homeTeam.score)
        self.period.text(viewData.game.period)
        self.view.data(viewData)
        visualizeWL()
        if (viewData.game.status == "final") {
            self.view.addClass('game-final')
        }

    }
    
    function setTips(template, viewData){
        tipContent = '<div class="hovercard" tid="v">Click to view Tweets for<br/> ' + template.find('.team-visiting .team-name').text() + '</div>'
        tipObj = {
            content: tipContent,
            show: 'mouseover',
            hide: { when: 'mouseout', fixed: true, delay:250 },
            style: {
                tip: false,
                cursor:'pointer',
                width: 250,
                height: 79,
                'background':'none',
                color:'#fff',
                'text-align':'center',
                'font-size':'11px',
                'padding-right':'10px',
                border:'none',
                classes: {
                    content:'.tweet-cta-tip'
                }
            },
            position: {
                corner: {
                    target: 'topMiddle',
                    tooltip: 'bottomMiddle'
                }, 
                adjust: { x: 12, y: 0 }
            },
            api: {
                onRender:function(){
                    var tid=this.elements.content.find('*[tid]').attr('tid')
                    if(tid == 'v'){
                        var t = self.visitingTeam
                    } else {
                        var t = self.homeTeam
                    }
                    this.elements.content.click({
                        'teamId': t
                    },
                    teamClick)
                }
            }
        }
        if(self.visitingTeam.name != "TBA"){
            template.find('.visiting-tweet-cta').qtip(tipObj)
        } else {
            template.find('.visiting-tweet-cta').hide()
        }
        
        tipObj.content = '<div class="hovercard" tid="h">Click to view Tweets for<br/> ' + template.find('.team-home .team-name').text() + '</div>'
        template.find('.home-tweet-cta').qtip(tipObj)
    }
    
    
    function sanitizeData(data) {

        var templateData = {
            'game': {
                'id': data.id
            }
        }

        templateData.date = Date.parse(data.date)
        templateData.date.addHours( - 4)
        self.date = templateData.date

        for (cid in data.competitor) {
            var c = data.competitor[cid]

            if (c.homeaway == "home") {
                templateData.homeTeam = c
                self.homeTeam = c
            } else {
                templateData.visitingTeam = c
                self.visitingTeam = c
            }
            //c.customData = Teams.getTeam(c.id)
            c.customData = self.teams.getTeam(c.shortName)

            if (c.customData == undefined) {
                c.customData = {}
                c.customData.hashTag = '#MM2011'
                c.hashTag = '#MM2011'
                c.customData.seed = ''
                c.customData.mentions = 0
                c.name = c.shortName
            } else {
                c.name = c.customData.displayName
                c.hashTag = c.customData.hashTag
                c.color = c.customData.color
                //self.teams.setTeamColor(c.shortName, c.color)
            }

            if (c.name.length > 20) {
                c.name = c.shortName
            }

        }


        if (data.eventstatus.status == "FINAL") {
            templateData.game.status = "final"
            templateData.game.period = "final"
            self.active = false
        } else if (data.eventstatus.status == "SCHEDULED") {
            templateData.game.status = "scheduled"
            templateData.game.period = templateData.date.toString("MMM d, h:mm tt") + " EST";
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
        if (obj.data.teamId.name != 'TBA') {
            dispatchEvent("onTeamSelect", self);
        }

    }
    

    function hashTagClick(obj) {
        self.hashTag = $(this).text();
        dispatchEvent("onHashTagClick", self);
        return false;
    }

    function addCommas(nStr)
    {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    return self;
}