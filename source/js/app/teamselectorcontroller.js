TeamSelectorController.prototype = new EventDispatcher();
TeamSelectorController.constructor = TeamSelectorController;
function TeamSelectorController()
 {
    var self = this;

    buildList();

    function buildList() {

        var teams = Teams.getAll();
        var teamData = [];
        var columnData = []

        for (t in teams) {
            teamData.push({
                'shortName': 'TEST',
                'name': teams[t].displayName
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
    }
    return self
}

