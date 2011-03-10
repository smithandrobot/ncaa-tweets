Teams = (function Teams() 
{
	var team_schema = {
        '12234' : {
            'displayName' : 'Hilltoppers',
            'color'        : '#97B7E0',
    		'feed'		   : '',
    		'hashTag'      : '#HillToppers'
        },
        '123' : {
            'displayName' : 'Wildcats',
            'color'        : '#97B7E0',
    		'feed'		   : '',
    		'hashTag'      : '#Wildcats'
        },
        '1234' : {
            'displayName' : 'Mean Green',
            'color'        : '#97B7E0',
    		'feed'		   : '',
    		'hashTag'      : '#Grean'
        },
        '12345' : {
            'displayName' : 'Bruins',
            'color'        : '#97B7E0',
    		'feed'		   : '',
    		'hashTag'      : '#Bruins'
        }
    }
    
	this.getTeam = getTeam;
	
	function getTeam(id)
	{
		return team_schema[id]
	}
	
	
	return this;
	
})();


