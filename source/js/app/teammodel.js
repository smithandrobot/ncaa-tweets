TeamsModel.prototype = new EventDispatcher();
TeamsModel.constructor = TeamsModel;
function TeamsModel() 
{
	var self = this;
	var feedURL = 'mock/streams.json';
	var model = new TRModel();
	model.addEventListener('onDataChange', onDataChange);
	var team_schema = []
    
	this.getTeam = getTeam;
	this.getAll = getAll;
	init();
	
	function init(){
	    Log('Fetching team data')
	    model.setStream(feedURL);
        model.loadJSON();
	}
	
	function onDataChange(e)
    {
        var data = e.target.getData()
        for(var s in data.streams){
            var stream = data.streams[s]
            var breaks = stream.name.split('-')
            
            if(breaks.length == 3){
                var teamData = stream.description.split('|')
                team_schema[breaks[2]] = {
                    'seed':$.trim(teamData[0]),
                    'displayName':$.trim(teamData[1]),
                    'hashTag':$.trim(teamData[2]),
                    'shortName':breaks[2],
                    'stream': stream.full_name + '-curated',
                    'mentions': stream.count.total
                }
                
            }
        }
        
        dispatchEvent("onTeamModelReady", self);
    }
	
	function getTeam(id)
	{
		return team_schema[id]
	}
	
	function getAll(){
	    return team_schema
	}
	
	
	return self;
	
}


