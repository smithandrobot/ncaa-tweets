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
        
        updateColors();
        dispatchEvent("onTeamModelReady", self);
        clearInterval(self.interval)
        self.interval = setInterval(poll, INTERVAL_TIME);
    }
    
    
    
    function setTeamColor(id, color){
        id = id.toLowerCase();
        if(self.team_schema[id]){
            self.team_schema[id].color = color;
        }
        
    }
	
	function getTeam(id)
	{
	    id = id.toLowerCase();
		return self.team_schema[id]
	}
	
	function getAll(){
	    return self.team_schema
	}
	
	function updateColors()
    {
        var colorValues = {
            'HAMP': {
                'color': '#005299',
                'name': 'Hampton Pirates'
            },
            'PRIN': {
                'color': '#FF9408',
                'name': 'Princeton Tigers'
            },
            'AKR': {
                'color': '#001D44',
                'name': 'Akron Zips'
            },
            'SMU': {
                'color': '#E73139',
                'name': 'Southern Methodist Mustangs'
            },
            'OAK': {
                'color': '#04091C',
                'name': 'Oakland Golden Grizzlies'
            },
            'PITT': {
                'color': '#00224A',
                'name': 'Pittsburgh Panthers'
            },
            'LIU': {
                'color': '#000000',
                'name': 'Long Island Blackbirds'
            },
            'FSU': {
                'color': '#7F001B',
                'name': 'Florida State Seminoles'
            },
            'CLEM': {
                'color': '#F35B0F',
                'name': 'Clemson Tigers'
            },
            'CONN': {
                'color': '#001D40',
                'name': 'Connecticut Huskies'
            },
            'TEX': {
                'color': '#EF7321',
                'name': 'Texas Longhorns'
            },
            'GONZ': {
                'color': '#37225F',
                'name': 'Gonzaga Bulldogs'
            },
            'TEM': {
                'color': '#BC0138',
                'name': 'Temple Owls'
            },
            'ND': {
                'color': '#00122B',
                'name': 'Notre Dame Fighting Irish'
            },
            'ODU': {
                'color': '#003665',
                'name': 'Old Dominion Monarchs'
            },
            'ARIZ': {
                'color': '#002449',
                'name': 'Arizona Wildcats'
            },
            'UAB': {
                'color': '#003B28',
                'name': 'UAB Blazers'
            },
            'ILL': {
                'color': '#F77329',
                'name': 'Illinois Fighting Illini'
            },
            'VAN': {
                'color': '#000000',
                'name': 'Vanderbilt Commodores'
            },
            'BYU': {
                'color': '#001C3C',
                'name': 'Brigham Young Cougars'
            },
            'XAV': {
                'color': '#004B80',
                'name': 'Xavier Musketeers'
            },
            'SJU': {
                'color': '#CC0033',
                'name': "St. John's Red Storm"
            },
            'UNC': {
                'color': '#99BFE5',
                'name': 'North Carolina Tar Heels'
            },
            'GMU': {
                'color': '#016600',
                'name': 'George Mason Patriots'
            },
            'SPC': {
                'color': '#001555',
                'name': "St. Peter's Peacocks"
            },
            'BU': {
                'color': '#CC0000',
                'name': 'Boston University Terriers'
            },
            'MEM': {
                'color': '#002447',
                'name': 'Memphis Tigers'
            },
            'ORU': {
                'color': '#002955',
                'name': 'Oral Roberts Golden Eagles'
            },
            'UCLA': {
                'color': '#004775',
                'name': 'UCLA Bruins'
            },
            'MIZZ': {
                'color': '#000000',
                'name': 'Missouri Tigers'
            },
            'SYR': {
                'color': '#002045',
                'name': 'Syracuse Orange'
            },
            'UALR': {
                'color': '#AD0000',
                'name': 'Arkansas-Little Rock Trojans'
            },
            'MARQ': {
                'color': '#083963',
                'name': 'Marquette Golden Eagles'
            },
            'KU': {
                'color': '#0060A5',
                'name': 'Kansas Jayhawks'
            },
            'TA&M': {
                'color': '#6A3333',
                'name': 'Texas A&M Aggies'
            },
            'PUR': {
                'color': '#211818',
                'name': 'Purdue Boilermakers'
            },
            'MORE': {
                'color': '#004FA2',
                'name': 'Morehead State Eagles'
            },
            'KSU': {
                'color': '#633194',
                'name': 'Kansas State Wildcats'
            },
            'DUKE': {
                'color': '#004582',
                'name': 'Duke Blue Devils'
            },
            'USC': {
                'color': '#A50010',
                'name': 'USC Trojans'
            },
            'BEL': {
                'color': '#182142',
                'name': 'Belmont Bruins'
            },
            'MSU': {
                'color': '#226B31',
                'name': 'Michigan State Spartans'
            },
            'MICH': {
                'color': '#001531',
                'name': 'Michigan Wolverines'
            },
            'CIN': {
                'color': '#000000',
                'name': 'Cincinnati Bearcats'
            },
            'UNLV': {
                'color': '#000000',
                'name': 'UNLV Rebels'
            },
            'WASH': {
                'color': '#3E3468',
                'name': 'Washington Huskies'
            },
            'USU': {
                'color': '#020767',
                'name': 'Utah State Aggies'
            },
            'INST': {
                'color': '#00669A',
                'name': 'Indiana State Sycamores'
            },
            'LOU': {
                'color': '#AD000A',
                'name': 'Louisville Cardinals'
            },
            'FLA': {
                'color': '#002D69',
                'name': 'Florida Gators'
            },
            'ALST': {
                'color': '#E9A900',
                'name': 'Alabama State Hornets'
            },
            'OSU': {
                'color': '#A00612',
                'name': 'Ohio State Buckeyes'
            },
            'BUT': {
                'color': '#0D1361',
                'name': 'Butler Bulldogs'
            },
            'WVU': {
                'color': '#001124',
                'name': 'West Virginia Mountaineers'
            },
            'UTSA': {
                'color': '#113B7D',
                'name': 'Texas-San Antonio Roadrunners'
            },
            'UNCA': {
                'color': '#092575',
                'name': 'North Carolina-Asheville Bulldogs'
            },
            'GTWN': {
                'color': '#001B50',
                'name': 'Georgetown Hoyas'
            },
            'WIS': {
                'color': '#C32122',
                'name': 'Wisconsin Badgers'
            },
            'UNCO': {
                'color': '#0E1831',
                'name': 'Northern Colorado Bears'
            },
            'RICH': {
                'color': '#9E0712',
                'name': 'Richmond Spiders'
            },
            'VILL': {
                'color': '#002D5B',
                'name': 'Villanova Wildcats'
            },
            'VCU': {
                'color': '#929292',
                'name': 'Virginia Commonwealth Rams'
            },
            'WOF': {
                'color': '#000000',
                'name': 'Wofford Terriers'
            },
            'BUCK': {
                'color': '#084280',
                'name': 'Bucknell Bison'
            },
            'TENN': {
                'color': '#D37907',
                'name': 'Tennessee Volunteers'
            },
            'SDSU': {
                'color': '#231F20',
                'name': 'San Diego State Aztecs'
            },
            'UCSB': {
                'color': '#101084',
                'name': 'UC Santa Barbara Gauchos'
            },
            'UK': {
                'color': '#004177',
                'name': 'Kentucky Wildcats'
            },
            'UGA': {
                'color': '#A0000B',
                'name': 'Georgia Bulldogs'
            },
            'PSU': {
                'color': '#002148',
                'name': 'Penn State Nittany Lions'
            }
        }
        
        for(c in colorValues){
            setTeamColor(c, colorValues[c].color)
        }
        
    }
	
	return self;
	
}


