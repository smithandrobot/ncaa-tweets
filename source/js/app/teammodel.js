Teams = (function Teams() 
{
	var team_schema = {
        '194' : {
        	"displayName":"Ohio st",
        	"hashTag":"#ohiost"
        },
        '2377' : {
        	"displayName":"Mcneese st",
        	"hashTag":"#mcneesest"
        },
        '2244' : {
        	"displayName":"George mason",
        	"hashTag":"#georgemason"
        },
        '52' : {
        	"displayName":"Florida st",
        	"hashTag":"#floridast"
        },
        '2306' : {
        	"displayName":"Kansas st",
        	"hashTag":"#kansasst"
        },
        '5' : {
        	"displayName":"Uab",
        	"hashTag":"#uab"
        },
        '2599' : {
        	"displayName":"St. john's",
        	"hashTag":"#stjohns"
        },
        '2083' : {
        	"displayName":"Bucknell",
        	"hashTag":"#bucknell"
        },
        '277' : {
        	"displayName":"West virginia",
        	"hashTag":"#westvirginia"
        },
        '130' : {
        	"displayName":"Michigan",
        	"hashTag":"#michigan"
        },
        '57' : {
        	"displayName":"Florida",
        	"hashTag":"#florida"
        },
        '2413' : {
        	"displayName":"Morehead st",
        	"hashTag":"#moreheadst"
        },
        '26' : {
        	"displayName":"Ucla",
        	"hashTag":"#ucla"
        },
        '2608' : {
        	"displayName":"Saint mary's",
        	"hashTag":"#saintmarys"
        },
        '87' : {
        	"displayName":"Notre dame",
        	"hashTag":"#notredame"
        },
        '2458' : {
        	"displayName":"Northern colorado",
        	"hashTag":"#northerncolorado"
        },
        '150' : {
        	"displayName":"Duke",
        	"hashTag":"#duke"
        },
        '2427' : {
        	"displayName":"North carolina-asheville",
        	"hashTag":"#northcarolinaasheville"
        },
        '295' : {
        	"displayName":"Old dominion",
        	"hashTag":"#olddominion"
        },
        '356' : {
        	"displayName":"Illinois",
        	"hashTag":"#illinois"
        },
        '41' : {
        	"displayName":"Connecticut",
        	"hashTag":"#connecticut"
        },
        '38' : {
        	"displayName":"Colorado",
        	"hashTag":"#colorado"
        },
        '275' : {
        	"displayName":"Wisconsin",
        	"hashTag":"#wisconsin"
        },
        '2473' : {
        	"displayName":"Oakland",
        	"hashTag":"#oakland"
        },
        '238' : {
        	"displayName":"Vanderbilt",
        	"hashTag":"#vanderbilt"
        },
        '127' : {
        	"displayName":"Michigan st",
        	"hashTag":"#michiganst"
        },
        '183' : {
        	"displayName":"Syracuse",
        	"hashTag":"#syracuse"
        },
        '2341' : {
        	"displayName":"Long island",
        	"hashTag":"#longisland"
        },
        '218' : {
        	"displayName":"Temple",
        	"hashTag":"#temple"
        },
        '264' : {
        	"displayName":"Washington",
        	"hashTag":"#washington"
        },
        '252' : {
        	"displayName":"Brigham young",
        	"hashTag":"#brighamyoung"
        },
        '299' : {
        	"displayName":"Long beach st",
        	"hashTag":"#longbeachst"
        },
        '2305' : {
        	"displayName":"Kansas",
        	"hashTag":"#kansas"
        },
        '2031' : {
        	"displayName":"Arkansas-little rock",
        	"hashTag":"#arkansaslittlerock"
        },
        '328' : {
        	"displayName":"Utah st",
        	"hashTag":"#utahst"
        },
        '2250' : {
        	"displayName":"Gonzaga",
        	"hashTag":"#gonzaga"
        },
        '2752' : {
        	"displayName":"Xavier",
        	"hashTag":"#xavier"
        },
        '228' : {
        	"displayName":"Clemson",
        	"hashTag":"#clemson"
        },
        '97' : {
        	"displayName":"Louisville",
        	"hashTag":"#louisville"
        },
        '2057' : {
        	"displayName":"Belmont",
        	"hashTag":"#belmont"
        },
        '245' : {
        	"displayName":"Texas a&m;",
        	"hashTag":"#texasam"
        },
        '222' : {
        	"displayName":"Villanova",
        	"hashTag":"#villanova"
        },
        '21' : {
        	"displayName":"San diego st",
        	"hashTag":"#sandiegost"
        },
        '282' : {
        	"displayName":"Indiana st",
        	"hashTag":"#indianast"
        },
        '46' : {
        	"displayName":"Georgetown",
        	"hashTag":"#georgetown"
        },
        '2086' : {
        	"displayName":"Butler",
        	"hashTag":"#butler"
        },
        '153' : {
        	"displayName":"North carolina",
        	"hashTag":"#northcarolina"
        },
        '2612' : {
        	"displayName":"St. peter's",
        	"hashTag":"#stpeters"
        },
        '221' : {
        	"displayName":"Pittsburgh",
        	"hashTag":"#pittsburgh"
        },
        '104' : {
        	"displayName":"Boston u",
        	"hashTag":"#bostonu"
        },
        '142' : {
        	"displayName":"Missouri",
        	"hashTag":"#missouri"
        },
        '269' : {
        	"displayName":"Marquette",
        	"hashTag":"#marquette"
        },
        '12' : {
        	"displayName":"Arizona",
        	"hashTag":"#arizona"
        },
        '103' : {
        	"displayName":"Boston college",
        	"hashTag":"#bostoncollege"
        },
        '96' : {
        	"displayName":"Kentucky",
        	"hashTag":"#kentucky"
        },
        '108' : {
        	"displayName":"Harvard",
        	"hashTag":"#harvard"
        },
        '2132' : {
        	"displayName":"Cincinnati",
        	"hashTag":"#cincinnati"
        },
        '257' : {
        	"displayName":"Richmond",
        	"hashTag":"#richmond"
        },
        '2509' : {
        	"displayName":"Purdue",
        	"hashTag":"#purdue"
        },
        '2309' : {
        	"displayName":"Kent st",
        	"hashTag":"#kentst"
        },
        '2439' : {
        	"displayName":"Unlv",
        	"hashTag":"#unlv"
        },
        '2633' : {
        	"displayName":"Tennessee",
        	"hashTag":"#tennessee"
        },
        '251' : {
        	"displayName":"Texas",
        	"hashTag":"#texas"
        },
        '2747' : {
        	"displayName":"Wofford",
        	"hashTag":"#wofford"
        }
    }
    
	this.getTeam = getTeam;
	
	function getTeam(id)
	{
		return team_schema[id]
	}
	
	
	return this;
	
})();


