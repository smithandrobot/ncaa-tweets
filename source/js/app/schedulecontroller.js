// inherits from
ScheduleController.prototype = new EventDispatcher();
ScheduleController.constructor = ScheduleController;
function ScheduleController()
 {
    var self = this;
    var selected = null;
    var model = new TRModel();
    var feedURL = 'mock/full.json';
    var INTERVAL_TIME = 1000 * 5;
    var interval = null;
    var games = []
    var loadedRound = null
    var scheduleData = null;

    model.addEventListener('onDataChange', onDataChange);

    self.loadRound = loadRound;
    
    function loadRound(round) {
        Log('Loading round: ' + round)
        games = []
        removeScrollbar();
        loadFeed();
        $('#scoreboard-loader').show();
        self.loadedRound = round
        
    }

    function getGamesForRound(round) {
        
        
        var eligibleGames = []
        
        var roundDates = getRoundDates(round)
        for(var g in self.scheduleData){
            var game = self.scheduleData[g]
            var gDate = new Date(game.date)
            Log(game.date)
            if(dates.inRange(gDate, roundDates.start, roundDates.end)){
                eligibleGames.push(game)
            }
        }
        
        
        
        return eligibleGames
    }

    function poll()
    {
        model.loadJSON();
    }

    function onDataChange(e)
    {
        var data = e.target.getData()
        self.scheduleData = data.events.event
        
        var gameList = getGamesForRound(self.loadedRound)
        
        if (games.length == 0) {
            $('#scoreboard-loader').hide();
            $(gameList).each(function() {
                renderGame($(this)[0])
            })
            addScrollbar()

        } else {
            $(gameList).each(function() {
                updateGame($(this)[0])
            })
        }

        clearInterval(self.interval)
        self.interval = setInterval(poll, INTERVAL_TIME);
    }

    function renderGame(data) {
        var game = new GameController(data);
        games.push(game)
        game.addEventListener("onTeamSelect", teamClick)

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



    function loadFeed()
    {

        model.setStream(feedURL);
        model.loadJSON();

    }



    function addScrollbar() {
        $('.schedule-scrollbar').scrollbar({
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

    var dates = {
        convert: function(d) {
            return (
            d.constructor === Date ? d:
            d.constructor === Array ? new Date(d[0], d[1], d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year, d.month, d.date) :
            NaN
            );
        },
        compare: function(a, b) {
            return (
            isFinite(a = this.convert(a).valueOf()) &&
            isFinite(b = this.convert(b).valueOf()) ?
            (a > b) - (a < b) :
            NaN
            );
        },
        inRange: function(d, start, end) {
            return (
            isFinite(d = this.convert(d).valueOf()) &&
            isFinite(start = this.convert(start).valueOf()) &&
            isFinite(end = this.convert(end).valueOf()) ?
            start <= d && d <= end:
            NaN
            );
        }
    }
    
    function getRoundDates(round){
        
        rounds = {
            'round1': {
                'start': new Date(2011, 2, 15, 0, 0, 0),
                'end': new Date(2011, 2, 16, 23, 59, 0)
            },
            'round2': {
                'start': new Date(2011, 2, 17, 0, 0, 0),
                'end': new Date(2011, 2, 19, 23, 59, 0)
            },
            'round3': {
                'start': new Date(2011, 2, 18, 0, 0, 0),
                'end': new Date(2011, 2, 20, 23, 59, 0)
            },
            'regionals': {
                'start': new Date(2011, 2, 24, 0, 0, 0),
                'end': new Date(2011, 2, 27, 23, 59, 0)
            },
            'finals': {
                'start': new Date(2011, 3, 2, 0, 0, 0),
                'end': new Date(2011, 3, 2, 23, 59, 0)
            },
            'championship': {
                'start': new Date(2011, 3, 4, 0, 0, 0),
                'end': new Date(2011, 3, 4, 23, 59, 0)
            }
            
        }
        
        return rounds[round]
    }

    return this;
};
