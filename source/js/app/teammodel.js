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
                        'tourneyStatus': teamData[3] == undefined ? "IN" : checkStatusOverride(breaks[2]),
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
        setTeamLocations()
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

    function setTeamLocations(){
        var teams = getTeamMeta()

        for(t in teams){
            var team = teams[t]
            var sn = t.toLowerCase()
            if(self.team_schema[sn] != undefined){
                self.team_schema[sn].coords = team.coords
            }

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

        var colorValues = getTeamMeta()

        for(c in colorValues){
            setTeamColor(c, colorValues[c].color)
        }

    }

    function getTeamMeta(){
        return {
            'HAMP': {
                'color': '#4892D3',
                'name': 'Hampton Pirates',
				'coords':{'x':570, 'y':135}
            },
            'PRIN': {
                'color': '#FF9408',
                'name': 'Princeton Tigers',
                'coords':{'x':562, 'y':105}
            },
            'AKR': {
                'color': '#CAB388',
                'name': 'Akron Zips',
				'coords':{'x':490, 'y':105}
            },
            'SMU': {
                'color': '#B10000',
                'name': 'Southern Methodist Mustangs',
				'coords':{'x':329, 'y':204}
            },
            'OAK': {
                'color': '#9A803E',
                'name': 'Oakland Golden Grizzlies',
				'coords':{'x':462, 'y':97}
            },
            'PITT': {
                'color': '#CEC499',
                'name': 'Pittsburgh Panthers',
				'coords':{'x':523, 'y':109}
            },
            'LIU': {
                'color': '#777777',
                'name': 'Long Island Blackbirds',
				'coords':{'x':570, 'y':99}
            },
            'FSU': {
                'color': '#990000',
                'name': 'Florida State Seminoles',
				'coords':{'x':529, 'y':224},
              'statusOverride':'IN'
            },
            'CLEM': {
                'color': '#F35B0F',
                'name': 'Clemson Tigers',
				'coords':{'x':519, 'y':168}
            },
            'CONN': {
                'color': '#2154A0',
                'name': 'Connecticut Huskies',
				'coords':{'x':566, 'y':91},
              'statusOverride':'IN'
            },
            'TEX': {
                'color': '#CC5500',
                'name': 'Texas Longhorns',
				'coords':{'x':304, 'y':237}
            },
            'GONZ': {
                'color': '#5D4F97',
                'name': 'Gonzaga Bulldogs',
				'coords':{'x':170, 'y':62}
            },
            'TEM': {
                'color': '#BC0138',
                'name': 'Temple Owls',
				'coords':{'x':557, 'y':107}
            },
            'ND': {
                'color': '#C5B358',
                'name': 'Notre Dame Fighting Irish',
				'coords':{'x':442, 'y':109}
            },
            'ODU': {
                'color': '#93BFEB',
                'name': 'Old Dominion Monarchs',
				'coords':{'x':569, 'y':135}
            },
            'ARIZ': {
                'color': '#C41E3A',
                'name': 'Arizona Wildcats',
				'coords':{'x':117, 'y':201},
              'statusOverride':'IN'
            },
            'UAB': {
                'color': '#006600',
                'name': 'UAB Blazers',
				'coords':{'x':468, 'y':192}
            },
            'ILL': {
                'color': '#F77329',
                'name': 'Illinois Fighting Illini',
				'coords':{'x':419, 'y':122}
            },
            'VAN': {
                'color': '#997F3D',
                'name': 'Vanderbilt Commodores',
				'coords':{'x':459, 'y':159}
            },
            'BYU': {
                'color': '#1A4F86',
                'name': 'Brigham Young Cougars',
				'coords':{'x':166, 'y':122},
              'statusOverride':'IN'
            },
            'XAV': {
                'color': '#3877B3',
                'name': 'Xavier Musketeers',
				'coords':{'x':473, 'y':125}
            },
            'SJU': {
                'color': '#CC0033',
                'name': "St. John's Red Storm",
				'coords':{'x':563, 'y':98}
            },
            'UNC': {
                'color': '#99BFE5',
                'name': 'North Carolina Tar Heels',
				'coords':{'x':555, 'y':153},
              'statusOverride':'IN'
            },
            'GMU': {
                'color': '#016600',
                'name': 'George Mason Patriots',
				'coords':{'x':551, 'y':126}
            },
            'SPC': {
                'color': '#3E81BE',
                'name': "St. Peter's Peacocks",
				'coords':{'x':561, 'y':102}
            },
            'BU': {
                'color': '#CC0000',
                'name': 'Boston University Terriers',
				'coords':{'x':574, 'y':84}
            },
            'MEM': {
                'color': '#3A6ED9',
                'name': 'Memphis Tigers',
				'coords':{'x':421, 'y':169}
            },
            'ORU': {
                'color': '#CFB53B',
                'name': 'Oral Roberts Golden Eagles',
				'coords':{'x':339, 'y':167}
            },
            'UCLA': {
                'color': '#0073CF',
                'name': 'UCLA Bruins',
				'coords':{'x':41, 'y':166}
            },
            'MIZZ': {
                'color': '#FFCC33',
                'name': 'Missouri Tigers',
				'coords':{'x':380, 'y':136}
            },
            'SYR': {
                'color': '#FF7F00',
                'name': 'Syracuse Orange',
				'coords':{'x':523, 'y':88}
            },
            'UALR': {
                'color': '#AD0000',
                'name': 'Arkansas-Little Rock Trojans',
				'coords':{'x':390, 'y':177}
            },
            'MARQ': {
                'color': '#FDBB30',
                'name': 'Marquette Golden Eagles',
				'coords':{'x':416, 'y':96},
              'statusOverride':'IN'
            },
            'KU': {
                'color': '#0060A5',
                'name': 'Kansas Jayhawks',
				'coords':{'x':343, 'y':136},
              'statusOverride':'IN'
            },
            'TAM': {
                'color': '#814D4C',
                'name': 'Texas A&M Aggies',
				'coords':{'x':331, 'y':235}
            },
            'PUR': {
                'color': '#B1946C',
                'name': 'Purdue Boilermakers',
				'coords':{'x':438, 'y':120}
            },
            'MORE': {
                'color': '#004FA2',
                'name': 'Morehead State Eagles',
				'coords':{'x':487, 'y':135}
            },
            'KSU': {
                'color': '#633194',
                'name': 'Kansas State Wildcats',
				'coords':{'x':332, 'y':137}
            },
            'DUKE': {
                'color': '#3C7FBF',
                'name': 'Duke Blue Devils',
				'coords':{'x':562, 'y':151},
              'statusOverride':'IN'
            },
            'USC': {
                'color': '#A50010',
                'name': 'USC Trojans',
				'coords':{'x':43, 'y':169}
            },
            'BEL': {
                'color': '#FF0000',
                'name': 'Belmont Bruins',
				'coords':{'x':462, 'y':162}
            },
            'MSU': {
                'color': '#4F8248',
                'name': 'Michigan State Spartans',
                'coords':{'x':444, 'y':95}
            },
            'MICH': {
                'color': '#F5D130',
                'name': 'Michigan Wolverines',
				'coords':{'x':452, 'y':98}
            },
            'CIN': {
                'color': '#E00122',
                'name': 'Cincinnati Bearcats',
				'coords':{'x':469, 'y':127}
            },
            'WASH': {
                'color': '#E8D3A2',
                'name': 'Washington Huskies',
				'coords':{'x':134, 'y':59}
            },
            'USU': {
                'color': '#0066CC',
                'name': 'Utah State Aggies',
				'coords':{'x':175, 'y':110}
            },
            'INST': {
                'color': '#00669A',
                'name': 'Indiana State Sycamores',
				'coords':{'x':434, 'y':122}
            },
            'LOU': {
                'color': '#FF0000',
                'name': 'Louisville Cardinals',
				'coords':{'x':460, 'y':136}
            },
            'FLA': {
                'color': '#FF4A00',
                'name': 'Florida Gators',
				'coords':{'x':571, 'y':237},
              'statusOverride':'IN'
            },
            'ALST': {
                'color': '#E9A900',
                'name': 'Alabama State Hornets',
				'coords':{'x':483, 'y':202}
            },
            'OSU': {
                'color': '#FF2000',
                'name': 'Ohio State Buckeyes',
				'coords':{'x':477, 'y':117},
              'statusOverride':'IN'
            },
            'BUT': {
                'color': '#3877B3',
                'name': 'Butler Bulldogs',
				'coords':{'x':446, 'y':121},
              'statusOverride':'IN'
            },
            'WVU': {
                'color': '#FFCC00',
                'name': 'West Virginia Mountaineers',
				'coords':{'x':513, 'y':120}
            },
            'UTSA': {
                'color': '#F47321',
                'name': 'Texas-San Antonio Roadrunners',
				'coords':{'x':287, 'y':254}
            },
            'UNCA': {
                'color': '#3877B3',
                'name': 'North Carolina-Asheville Bulldogs',
				'coords':{'x':516, 'y':157}
            },
            'GTWN': {
                'color': '#999999',
                'name': 'Georgetown Hoyas',
				'coords':{'x':549, 'y':119}
            },
            'WIS': {
                'color': '#C32122',
                'name': 'Wisconsin Badgers',
				'coords':{'x':403, 'y':98},
              'statusOverride':'IN'
            },
            'UNCO': {
                'color': '#FFCC33',
                'name': 'Northern Colorado Bears',
				'coords':{'x':242, 'y':125}
            },
            'RICH': {
                'color': '#9E0712',
                'name': 'Richmond Spiders',
				'coords':{'x':551, 'y':133},
              'statusOverride':'IN'
            },
            'VILL': {
                'color': '#B8D7E4',
                'name': 'Villanova Wildcats',
				'coords':{'x':551, 'y':107}
            },
            'VCU': {
                'color': '#F8B800',
                'name': 'Virginia Commonwealth Rams',
				'coords':{'x':554, 'y':136},
              'statusOverride':'IN'
            },
            'WOF': {
                'color': '#CFB53B',
                'name': 'Wofford Terriers',
				'coords':{'x':509, 'y':124}
            },
            'BUCK': {
                'color': '#FF9900',
                'name': 'Bucknell Bison',
				'coords':{'x':533, 'y':103}
            },
            'TENN': {
                'color': '#F77F00',
                'name': 'Tennessee Volunteers',
				'coords':{'x':491, 'y':157}
            },
            'SDSU': {
                'color': '#A81933',
                'name': 'San Diego State Aztecs',
				'coords':{'x':47, 'y':187},
              'statusOverride':'IN'
            },
            'UCSB': {
                'color': '#EAAF0F',
                'name': 'UC Santa Barbara Gauchos',
				'coords':{'x':33, 'y':163}
            },
            'UK': {
                'color': '#3877B3',
                'name': 'Kentucky Wildcats',
				'coords':{'x':473, 'y':136},
              'statusOverride':'IN'
            },
            'UGA': {
                'color': '#FF0000',
                'name': 'Georgia Bulldogs',
				'coords':{'x':514, 'y':182}
            },
            'PSU': {
                'color': '#3877B3',
                'name': 'Penn State Nittany Lions',
				'coords':{'x':525, 'y':105}
            }
        }
    }


  function checkStatusOverride(id) {
    //force "OUT"
    return "OUT"
    var meta = getTeamMeta()
    var team = meta[id.toUpperCase()]
    if(!team) {
      return "OUT";
    }

    return team.statusOverride != undefined ? team.statusOverride : "OUT";

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


