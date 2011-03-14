TeamsModel.prototype = new EventDispatcher();
TeamsModel.constructor = TeamsModel;
function TeamsModel() 
{
	var self = this;
	var feedURL = 'http://tweetriver.com/mr_mm_2011.json';
	var model = new TRModel();
	model.addEventListener('onDataChange', onDataChange);
	var team_schema = null;
	var INTERVAL_TIME = 1000 * 5;
	var teamsLoaded = false;
    
	this.getTeam = getTeam;
	this.getAll = getAll;
	this.setTeamColor = setTeamColor;
	
	init();
	
	function init(){
	    Log('Fetching team data')
	    self.team_schema = {}
	    model.setStream(feedURL);
        model.load(null, 'jsonp');
	}
	
	function poll()
    {
        model.load(null, 'jsonp');
    }
    
	function onDataChange(e)
    {
        var data = e.target.getData()
        
        if(!teamsLoaded){
            for(var s in data.streams){
                var stream = data.streams[s]
                var breaks = stream.name.split('-')

                if(breaks.length == 3){
                    var teamData = stream.description.split('|')
                    self.team_schema[breaks[2]] = {
                        'seed':$.trim(teamData[0]),
                        'displayName':$.trim(teamData[1]),
                        'hashTag':$.trim(teamData[2]),
                        'shortName':breaks[2],
                        'stream': stream.full_name + '-curated',
                        'mentions': stream.count.total
                    }

                }
            }
            teamsLoaded = true
        } else {
            for(var s in data.streams){
                var stream = data.streams[s]
                var breaks = stream.name.split('-')

                if(breaks.length == 3){
                    var team = self.team_schema[breaks[2]]
                    if(team){
                        team.mentions = stream.count.total
                    }
                    
                }
            }
        }
        
        
        dispatchEvent("onTeamModelReady", self);
        clearInterval(self.interval)
        self.interval = setInterval(poll, INTERVAL_TIME);
    }
    
    function setTeamColor(id, color){
        id = id.toLowerCase();
        self.team_schema[id].color = color;
        //Log(self.team_schema[id])
    }
	
	function getTeam(id)
	{
	    id = id.toLowerCase();
		return self.team_schema[id]
	}
	
	function getAll(){
	    return self.team_schema
	}
	
	
	return self;
	
}


