// inherits from
ScheduleController.prototype = new EventDispatcher();
ScheduleController.constructor = ScheduleController;
function ScheduleController()
 {
    var self = this;
    var selected = null;
    var hashTag = null;
    var model = new TRModel();
    var feedURLs = [];
    var INTERVAL_TIME = 1000 * 5;
    var interval = null;
    var games = []
    var loadedRound = null
    var scheduleData = null;
    var firstActive = null;
    var teams = null;
    var scroller = null;
    var streamLoadCount = 0;

    model.addEventListener('onDataChange', onDataChange);

    self.loadRound = loadRound;
    self.setTeamModel = setTeamModel;
    
    function setTeamModel(model){
        self.teams = model
    }
    
    function loadRound(round) {
        getFeedsForRound(round)
        
        Log('Loading round: ' + round)
        games = []
        removeScrollbar();
        loadFeed();
        $('#scoreboard-loader').show();
        self.loadedRound = round
        
    }
    
    function getFeedsForRound(round){
        var dates = getRoundDates(round)
        var r = [dates.start.clone()]
        feedURLs = []
        while(dates.start < dates.end){
            dates.start.add({ days: 1})
            var d = dates.start.clone()
            r.push(d)
        }
        
        for(var d in r){
            var feed = 'mock/events-' + r[d].toString('yyyyMMdd') + '.json'
            feedURLs.push(feed)
        }
        
    }

    function getGamesForRound(round) {
        
        var eligibleGames = []
        
        var roundDates = getRoundDates(round)
        for(var g in self.scheduleData){
            var game = self.scheduleData[g]
            //Log(game)
            var allow = true
            for(c in game.competitor){
                if(!self.teams.getTeam(game.competitor[c].shortName)){
                    if(game.competitor[c].shortName != "TBA"){
                        allow = false;
                    }
                    
                }
            }
            if(allow){
                eligibleGames.push(game)
            }
            
        }
        
        return eligibleGames
    }

    function poll()
    {
        getFeedsForRound(self.loadedRound)
        for(var f in feedURLs){
            model.setStream(feedURLs[f]);
            model.loadJSON();
        }
        Log('Polling scores..')
    }

    function onDataChange(e)
    {
        var data = e.target.getData()
        self.scheduleData = data.events.event
        
        var gameList = getGamesForRound(self.loadedRound)
        

        
        if (streamLoadCount > 0) {
            streamLoadCount--;
            $('#scoreboard-loader').hide();
            $(gameList).each(function() {
                var game = renderGame($(this)[0])
                if(game.active && self.firstActive == null){
                    self.firstActive = game;
                }
            })
            
            if(self.firstActive){
                var pos = self.firstActive.view.position();
                //$("#schedule_list .scrollbar-pane").css('top', pos.top)
                //$("#schedule-container").scrollTop(pos.top)
            }
            
            if(streamLoadCount == 0){
                addScrollbar()
            }
        } else {
            
            $(gameList).each(function() {
                updateGame($(this)[0])
            })
        }

        
    }
    
    

    function renderGame(data) {
        
        var game = new GameController(data, self.teams);
        games.push(game)
        game.addEventListener("onTeamSelect", teamClick)
        game.addEventListener('onHashTagClick', onHashTagClick)
        return game
    }

    function updateGame(data) {
        for (game in games) {
            if (games[game].id == data.id) {
                games[game].update(data)
            }
        }

    }

    function teamClick(obj) {
        self.selected = {
            'team': obj.target.selected
        }
        dispatchEvent("onTeamSelect", self);
    }

    function onHashTagClick(obj){
	    self.hashTag = obj.target.hashTag
	    dispatchEvent("onHashTagClick", self);
	    return false;
	}


    function loadFeed()
    {
        streamLoadCount = feedURLs.length
        for(var f in feedURLs){
            model.setStream(feedURLs[f]);
            model.loadJSON();
        }
        
        clearInterval(self.interval)
        self.interval = setInterval(poll, INTERVAL_TIME);
    }



    function addScrollbar() {
       
        scroller = $('.schedule-scrollbar').scrollbar({
            handleHeight: 151,
            arrows: false
        });
        
    }

    function removeScrollbar() {
        var l = $('#scoreboard-loader').detach();
        $("#schedule-container").empty();
        $("#schedule_list .scrollbar-pane").remove();
        $("#schedule_list .scrollbar-handle-container").remove();
        $("#schedule_list .scrollbar-handle-up").remove();
        $("#schedule_list .scrollbar-handle-down").remove();
        $("#schedule-container").prepend(l);
    }

    
    
    function getRoundDates(round){
        
        rounds = {
            'round1': {
                'start': new Date(2011, 2, 15),
                'end': new Date(2011, 2, 16)
            },
            'round2': {
                'start': new Date(2011, 2, 17),
                'end': new Date(2011, 2, 18)
            },
            'round3': {
                'start': new Date(2011, 2, 19),
                'end': new Date(2011, 2, 20)
            },
            'regionals': {
                'start': new Date(2011, 2, 24),
                'end': new Date(2011, 2, 27)
            },
            'finals': {
                'start': new Date(2011, 3, 2),
                'end': new Date(2011, 3, 2)
            },
            'championship': {
                'start': new Date(2011, 3, 4),
                'end': new Date(2011, 3, 4)
            }
            
        }
        
        return rounds[round]
    }

    return this;
};
