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
                    
                    if(self.team_schema[breaks[2]].shortName == 'TA&M'){
                        self.team_schema[breaks[2]].shortName = 'TAM'
                    }

                }
            }
            self.team_schema = sortTeams(self.team_schema)
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
                'color': '#4892D3',
                'name': 'Hampton Pirates'
            },
            'PRIN': {
                'color': '#FF9408',
                'name': 'Princeton Tigers'
            },
            'AKR': {
                'color': '#CAB388',
                'name': 'Akron Zips'
            },
            'SMU': {
                'color': '#B10000',
                'name': 'Southern Methodist Mustangs'
            },
            'OAK': {
                'color': '#9A803E',
                'name': 'Oakland Golden Grizzlies'
            },
            'PITT': {
                'color': '#CEC499',
                'name': 'Pittsburgh Panthers'
            },
            'LIU': {
                'color': '#777777',
                'name': 'Long Island Blackbirds'
            },
            'FSU': {
                'color': '#990000',
                'name': 'Florida State Seminoles'
            },
            'CLEM': {
                'color': '#F35B0F',
                'name': 'Clemson Tigers'
            },
            'CONN': {
                'color': '#2154A0',
                'name': 'Connecticut Huskies'
            },
            'TEX': {
                'color': '#CC5500',
                'name': 'Texas Longhorns'
            },
            'GONZ': {
                'color': '#5D4F97',
                'name': 'Gonzaga Bulldogs'
            },
            'TEM': {
                'color': '#BC0138',
                'name': 'Temple Owls'
            },
            'ND': {
                'color': '#C5B358',
                'name': 'Notre Dame Fighting Irish'
            },
            'ODU': {
                'color': '#93BFEB',
                'name': 'Old Dominion Monarchs'
            },
            'ARIZ': {
                'color': '#C41E3A',
                'name': 'Arizona Wildcats'
            },
            'UAB': {
                'color': '#006600',
                'name': 'UAB Blazers'
            },
            'ILL': {
                'color': '#F77329',
                'name': 'Illinois Fighting Illini'
            },
            'VAN': {
                'color': '#997F3D',
                'name': 'Vanderbilt Commodores'
            },
            'BYU': {
                'color': '#1A4F86',
                'name': 'Brigham Young Cougars'
            },
            'XAV': {
                'color': '#3877B3',
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
                'color': '#3E81BE',
                'name': "St. Peter's Peacocks"
            },
            'BU': {
                'color': '#CC0000',
                'name': 'Boston University Terriers'
            },
            'MEM': {
                'color': '#3A6ED9',
                'name': 'Memphis Tigers'
            },
            'ORU': {
                'color': '#CFB53B',
                'name': 'Oral Roberts Golden Eagles'
            },
            'UCLA': {
                'color': '#0073CF',
                'name': 'UCLA Bruins'
            },
            'MIZZ': {
                'color': '#FFCC33',
                'name': 'Missouri Tigers'
            },
            'SYR': {
                'color': '#FF7F00',
                'name': 'Syracuse Orange'
            },
            'UALR': {
                'color': '#AD0000',
                'name': 'Arkansas-Little Rock Trojans'
            },
            'MARQ': {
                'color': '#FDBB30',
                'name': 'Marquette Golden Eagles'
            },
            'KU': {
                'color': '#0060A5',
                'name': 'Kansas Jayhawks'
            },
            'TAM': {
                'color': '#814D4C',
                'name': 'Texas A&M Aggies'
            },
            'PUR': {
                'color': '#B1946C',
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
                'color': '#3C7FBF',
                'name': 'Duke Blue Devils'
            },
            'USC': {
                'color': '#A50010',
                'name': 'USC Trojans'
            },
            'BEL': {
                'color': '#FF0000',
                'name': 'Belmont Bruins'
            },
            'MSU': {
                'color': '#4F8248',
                'name': 'Michigan State Spartans'
            },
            'MICH': {
                'color': '#F5D130',
                'name': 'Michigan Wolverines'
            },
            'CIN': {
                'color': '#E00122',
                'name': 'Cincinnati Bearcats'
            },
            'UNLV': {
                'color': '#FF2400',
                'name': 'UNLV Rebels'
            },
            'WASH': {
                'color': '#E8D3A2',
                'name': 'Washington Huskies'
            },
            'USU': {
                'color': '#0066CC',
                'name': 'Utah State Aggies'
            },
            'INST': {
                'color': '#00669A',
                'name': 'Indiana State Sycamores'
            },
            'LOU': {
                'color': '#FF0000',
                'name': 'Louisville Cardinals'
            },
            'FLA': {
                'color': '#FF4A00',
                'name': 'Florida Gators'
            },
            'ALST': {
                'color': '#E9A900',
                'name': 'Alabama State Hornets'
            },
            'OSU': {
                'color': '#FF2000',
                'name': 'Ohio State Buckeyes'
            },
            'BUT': {
                'color': '#3877B3',
                'name': 'Butler Bulldogs'
            },
            'WVU': {
                'color': '#FFCC00',
                'name': 'West Virginia Mountaineers'
            },
            'UTSA': {
                'color': '#F47321',
                'name': 'Texas-San Antonio Roadrunners'
            },
            'UNCA': {
                'color': '#3877B3',
                'name': 'North Carolina-Asheville Bulldogs'
            },
            'GTWN': {
                'color': '#999999',
                'name': 'Georgetown Hoyas'
            },
            'WIS': {
                'color': '#C32122',
                'name': 'Wisconsin Badgers'
            },
            'UNCO': {
                'color': '#FFCC33',
                'name': 'Northern Colorado Bears'
            },
            'RICH': {
                'color': '#9E0712',
                'name': 'Richmond Spiders'
            },
            'VILL': {
                'color': '#B8D7E4',
                'name': 'Villanova Wildcats'
            },
            'VCU': {
                'color': '#F8B800',
                'name': 'Virginia Commonwealth Rams'
            },
            'WOF': {
                'color': '#CFB53B',
                'name': 'Wofford Terriers'
            },
            'BUCK': {
                'color': '#FF9900',
                'name': 'Bucknell Bison'
            },
            'TENN': {
                'color': '#F77F00',
                'name': 'Tennessee Volunteers'
            },
            'SDSU': {
                'color': '#A81933',
                'name': 'San Diego State Aztecs'
            },
            'UCSB': {
                'color': '#EAAF0F',
                'name': 'UC Santa Barbara Gauchos'
            },
            'UK': {
                'color': '#3877B3',
                'name': 'Kentucky Wildcats'
            },
            'UGA': {
                'color': '#FF0000',
                'name': 'Georgia Bulldogs'
            },
            'PSU': {
                'color': '#3877B3',
                'name': 'Penn State Nittany Lions'
            }
        }
        
        
        for(c in colorValues){
            setTeamColor(c, colorValues[c].color)
        }
        
    }
    
    function sortTeams(o) {
        var sorted = {},
        key, a = [];
        for (key in o) {
            if (o.hasOwnProperty(key)) {
                if(key != 'all' && key != 'experts' && key != 'verizon') {
                    a.push({"sn": key, "name" : o[key].displayName});
                }
                    
            }
        }

        a = a.sort(function(a,b){return a.name>b.name ? 1 : a.name<b.name ? -1 : 0})

        for (key = 0; key < a.length; key++) {
            sorted[a[key].sn] = o[a[key].sn];
        }
        return sorted;
    }
	
	return self;
	
}


