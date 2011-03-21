TweetCountController.prototype = new EventDispatcher();
TweetCountController.constructor = TweetCountController;
function TweetCountController()
 {
    var self     = this;
    self.teams   = null;
    self.counts  = null;
    
    self.populate = populate
    
    function populate(teams){
        self.teams = teams;
        self.counts = []
        totalcount = 0
        var teamlist = teams.getAll()
        for(t in teamlist){
            var team = teamlist[t]
            var mentions = parseInt(team.mentions)
            totalcount += mentions
            self.counts.push({
                'name'      : team.displayName,
                'mentions'  : mentions,
                'shortName' :team.shortName
            })
        }
        self.counts = self.counts.sort(function(a,b){return b.mentions - a.mentions})
        
        $("#grand-total h1").text(Utils.addCommas(totalcount))
        
        var counttemplate = '<li class="team-count"><a href="#" tid="${shortName}"><span class="name">${name}</span><span class="mentions">${mentions}</span></a></li>'

        $.template("counts", counttemplate);
        var teamListView = $.tmpl("counts", self.counts);
        Log(teamListView)
        $('#overall-count ul').append(teamListView)
        $('.count-scrollbar').scrollbar({
            handleHeight: 60,
            arrows: false
        });
    
    $('#map').append('<div></div>')
    $('#map').click(function(event){
        var x = event.pageX - 251
        var y = event.pageY - 1076
        $('#map div').html(",coords:{'x':" + x + ", 'y':" + y + "}")
    })
    }
    
    return self
}

