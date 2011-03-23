TweetCountController.prototype = new EventDispatcher();
TweetCountController.constructor = TweetCountController;
function TweetCountController()
{
  var self     = this;
  self.teams   = null;
  self.counts  = null;
  self.totalcount = null;
  self.heatMin = .25
    self.heatfactor = .75;
  self.filterFinalists = true;

  self.populate = populate

    function populate(teams){
    self.teams = teams;
    teams.addEventListener("onTeamModelReady", onTeamDataUpdate)

    getCounts();

    $("#grand-total h1").text(Utils.addCommas(self.totalcount))

    var counttemplate = '<li class="team-count" tid="${shortName}"><span class="name">${name}</span> '
    counttemplate += '<span class="mentions">${Utils.addCommas(mentions)}</span></li>'

    var hotSpotTemplate = '<div class="map-hotspot" tid="${shortName}" style="top:${coords.y}px;left:${coords.x}px;"></div>'

    var glowTemplate = '<div class="map-glow" style="top:${coords.y}px;left:${coords.x}px;">'
    glowTemplate += '<img src="img/campus-glow-${intensity}.png"  height ="${gfactor.h}" width="${gfactor.w}"/></div>'

    $.template("counts", counttemplate);
    $.template("hotSpots", hotSpotTemplate);
    $.template("glowSpots", glowTemplate);

    var teamListView = $.tmpl("counts", self.counts);


    $('#overall-count ul').append(teamListView)
    $('.team-count').first().addClass('mentions-first')
    $('.team-count').first().next().addClass('mentions-second')
    $('.team-count').first().next().next().addClass('mentions-third')
    $('.team-count').first().next().next().next().addClass('mentions-fourth')
    $('.team-count').first().next().next().next().next().addClass('mentions-fifth')

    $('.count-scrollbar').scrollbar({
      handleHeight: 60,
          arrows: false
          });

    var topCount = 0
    var positions = []
    var hsPositions = []

    for(c in self.counts){
      var team = self.teams.getTeam(self.counts[c].shortName)
      if(self.filterFinalists && team.tourneyStatus == "OUT"){
        continue;
      } else if(self.filterFinalists && team.tourneyStatus == "IN") {
        if(topCount < team.mentions) {
          topCount = team.mentions
        }

      }

      if(team.coords){
        var coords = {
        'x' : Math.round(team.coords.x)-4,
        'y' : Math.round(team.coords.y)-3
        }
        hsPositions.push({'coords':coords, 'shortName': self.counts[c].shortName})
      } else {
        Log("missing coords: " + self.counts[c].shortName)
      }

    }

    if(topCount == 0) {
      topCount = self.counts[0].mentions
    }

    for(c in self.counts){
      var team = self.teams.getTeam(self.counts[c].shortName)
      if(self.filterFinalists && team.tourneyStatus == "OUT"){
        Log("Filtered: " + team.displayName)
        continue;
      }
      if(team.coords){
        var scaleFactor = (((team.mentions/topCount)*self.heatFactor)+self.heatMin)
        var intensity = Math.round((scaleFactor/(self.heatFactor + self.heatMin))*10)
        intensity = intensity <= 10 ? intensity : 10
        var coords = team.coords
        var gfactor = {'w':Math.floor(84*scaleFactor), 'h':Math.floor(47*scaleFactor)}
        coords.x = coords.x - gfactor.w/2
        coords.y = coords.y - gfactor.h/2
        positions.push({'coords':coords, 'intensity': intensity, 'gfactor':gfactor})
      } else {
        Log("missing coords: " + self.counts[c].shortName)
      }

    }



    positions = positions.sort(function(a,b){return a.intensity - b.intensity})

    var hotSpots = $.tmpl("hotSpots", hsPositions);
    var glowSpots = $.tmpl("glowSpots", positions);

    $("#map").append('<div id="glow-container"></div>')
    $("#map").append('<div id="hotspot-container"></div>')
    $("#hotspot-container").append(hotSpots)
    $("#glow-container").append(glowSpots)

    for(c in self.counts){
      setTip(self.counts[c].shortName, self.counts[c].mentions)
        }

    $('.team-count').each(function(){
        $(this).click(function(){
            self.selected = {'team': self.teams.getTeam($(this).attr('tid'))}
            dispatchEvent("onTeamSelect", self);

            scrollToTweets()
              })
          })
  }

  function getCounts(){
    self.counts = []
      self.totalcount = 0

      var teamlist = self.teams.getAll()
      for(t in teamlist){
        var team = teamlist[t]
        var mentions = parseInt(team.mentions)
        self.totalcount += mentions
        self.counts.push({
          'name'      : team.displayName,
              'mentions'  : mentions,
              'shortName' : team.shortName
              })
      }
    self.counts = self.counts.sort(function(a,b){return b.mentions - a.mentions})
      for(c in self.counts){
        var team = self.counts[c]
        //team.mentions = Utils.addCommas(team.mentions)
      }
    //return self.counts
  }

  function setTip(t, mentions){
    var team = self.teams.getTeam(t)
      tipContent = '<div class="hovercard no-arrow" tid="' + team.shortName + '">' + team.displayName + '<br />' + Utils.addCommas(mentions) + ' Mentions</div>'
      tipObj = {
    content: tipContent,
    show: 'mouseover',
    hide: {
      when: 'mouseout',
      fixed: false
      },
    style: {
      tip: false,
      cursor: 'pointer',
      width: 250,
      height: 79,
      'background': 'none',
      color: '#fff',
      'text-align': 'center',
      'font-size': '11px',
      'padding-right': '10px',
      border: 'none',
      classes: {
        content: '.tweet-cta-tip'
        }
    },
    position: {
      corner: {
        target: 'topMiddle',
        tooltip: 'bottomMiddle'
      },
      adjust: {
        x: 12,
        y: 0
      }
    },
    api: {
      onRender: function() {
          var tid = this.elements.content.find('*[tid]').attr('tid')
          $("#hotspot-container").find('div[tid="'+tid+'"]').click({
            'teamId': self.teams.getTeam(tid)
                },
            teamClick)
        }
    }
    }
    $("#hotspot-container").find('div[tid="'+t+'"]').qtip(tipObj)
      }

  function teamClick(obj) {
    self.selected = {'team': obj.data.teamId}
    if (obj.data.teamId.name != 'TBA') {
      dispatchEvent("onTeamSelect", self);
    }

    scrollToTweets()


      }

  function scrollToTweets(){
    var target_offset = $("#tweet-streams").offset();
    var target_top = target_offset.top;
    $('html, body').animate({scrollTop:target_top}, 500);
  }

  function onTeamDataUpdate(e){
    getCounts()
      for(c in self.counts){
        var team = self.counts[c]
          $('li[tid="'+team.shortName+'"]').find('.mentions').text(Utils.addCommas(team.mentions))
          }
    $("#grand-total h1").text(Utils.addCommas(self.totalcount))
      }

  return self
    }

