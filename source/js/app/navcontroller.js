NavController.prototype = new EventDispatcher();
NavController.constructor = NavController;
function NavController() 
{
    var self          = this;
    var view          = null;
    var selected      = null;
    
    self.activateRound = activateRound;
    self.setAvailableRounds = setAvailableRounds
    activate();
    
    function activate(){
        self.view = $('#tournament_nav')
        self.view.find('a').each(function(){
            $(this).click(navClick)
        })
    }
    
    function setAvailableRounds(rounds){
        for(round in rounds){
            var t = self.view.find('#'+rounds[round])
            if(t){
                t.parent().addClass('active')
                t.parent().removeClass('inactive')
            }
            
        }
    }
    
    function activateRound(round){
        self.view.find('#'+round).trigger('click')
    }
    
    function navClick(e){
        var t = $(e.target);
        var p = t.parent();
        
        if(p.is('.inactive')){
            return false;
        }
        
        self.selected = t.attr('id');
        
        var current = self.view.find('.tournament-selected');
        current.removeClass('tournament-selected');
        current.addClass('active');
        p.removeClass('active');
        p.addClass('tournament-selected');
        dispatchEvent("onRoundSelect", self);
        
        return false;
    }
    
    return self
}