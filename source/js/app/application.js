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
    var teams     = new TeamsModel();

    var tweetBox = $('#tbox');

    this.toString = toString;
    
    teams.addEventListener("onTeamModelReady", onTeamModelReady)
    
    
    
    function onTeamModelReady(e){
        teams.removeEventListener("onTeamModelReady", this)
        Log('model ready')
        nav.addEventListener('onRoundSelect', onRoundSelect);
        nav.setAvailableRounds(['round1', 'round2'])
        nav.activateRound('round1');
        
        selector.buildList(teams)
        selector.addEventListener('onTeamSelect', onTeamSelect)
        schedules.addEventListener('onTeamSelect', onTeamSelect)
        schedules.addEventListener('onHashTagClick', onHashTagClick)
        schedules.setTeamModel(teams)
    }
    
    function onRoundSelect(e) {
        schedules.loadRound(e.target.selected)
    }
    
    function onTeamSelect(e){
        Log(e.target.selected)
		tweetlist.selectTeam( e.target.selected );
    }
    
    function onHashTagClick(e){
        Log(e.target.hashTag)
		tweetlist.hashTagClick( e.target.hashTag );
    }

    function toString() {
        return "Application";
    };
};