TeamSelectorController.prototype = new EventDispatcher();
TeamSelectorController.constructor = TeamSelectorController;
function TeamSelectorController()
 {
    var self     = this;
    var selected = null;
    var teams    = null;

    self.buildList = buildList;

    function checkCookiedTeam(){
        var cTeam = null
        
        if($.cookie('team')){
            var teamlist = self.teams.getAll();
            var tid = $.cookie('team');
            cTeam = {'team':teamlist[tid]}
        }
        
        return cTeam;
        
    }
    
    function buildList(teams) {
        self.teams = teams;
        var teamData = [];
        var columnData = []
        
        var teamlist = self.teams.getAll();
        for (t in teamlist) {
            teamData.push({
                'shortName': teamlist[t].shortName,
                'name': teamlist[t].displayName
            })
        }

        var columns = '{{each columns}}<ul class="team-column">{{each $value}}<li><a href="#" id="${$value.shortName}">${$value.name}</a></li>{{/each}}</ul>{{/each}}'

        $.template("columns", columns);

        var columnList = [
            teamData.splice(0, 10),
            teamData.splice(0, 10),
            teamData.splice(0, 10),
            teamData.splice(0, 10),
            teamData.splice(0, 13),
            teamData.splice(0, 13)
        ]

        var teamListView = $.tmpl("columns", {
            'columns': columnList
        });
        
        $('#team-selector a').qtip({
            content: teamListView,
            show: 'mouseover',
            hide: {
                fixed: true
            },
            api : {
                onRender:activateLinks
            },
            style: {
                tip: 'bottomRight',
                width: 700,
                border: {
                    width: 0,
                    radius: 5,
                    color: '#fff'
                }
            },
            position: {
                corner: {
                    target: 'topMiddle',
                    tooltip: 'bottomRight'
                }
            }
        })
        
        var faveTeam = checkCookiedTeam()
        
        if(faveTeam){
            self.selected = faveTeam
            dispatchEvent("onTeamSelect", self);
        }
    }
    
    function activateLinks(){
        $('.team-column a').each(function(){
            $(this).click(function(){
                var teamlist = self.teams.getAll();
                var tid = $(this).attr('id');
                self.selected = {'team':teamlist[tid]}
                $.cookie('team', tid, { expires: 30, path: '/' });
        	    dispatchEvent("onTeamSelect", self);
                return false;
            })
        })
    }
    return self
}

