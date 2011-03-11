$(document).ready(function() {
    var a = new Application();
});

function Application()
 {
    var server    = 'http://tr-cache-2.appspot.com/massrelevance/';
    var schedules = new ScheduleController();
    var tweetlist = new TweetListController();
    var nav       = new NavController();
    var selector  = new TeamSelectorController();

    var tweetBox = $('#tbox');

    this.toString = toString;

    nav.addEventListener('onRoundSelect', onRoundSelect);
    nav.setAvailableRounds(['round1', 'round2'])
    nav.activateRound('round1');
    
    selector.addEventListener('onTeamSelect', onTeamSelect)
    schedules.addEventListener('onTeamSelect', onTeamSelect)

    function onRoundSelect(e) {
        schedules.loadRound(e.target.selected)
    }
    
    function onTeamSelect(e){
        Log(e.target.selected)
    }

    function toString() {
        return "Application";
    };
};