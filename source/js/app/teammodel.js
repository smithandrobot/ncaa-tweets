Teams = (function Teams() 
{
	var team_schema = {
        '1234' : {
            'display_name' : 'Tarheels',
            'color'        : '#97B7E0',
    		'feed'		   : ''
        }
    }
    
	this.getTeam = getTeam;
	
	function getTeam(id)
	{
		return team_schema[id]
	}
	
	
	return this;
	
})();


