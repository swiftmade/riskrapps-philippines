module.exports = (function() {
    
    var $body = $('body');

    function showOverlay($el) {
        $(window).scrollTop(0);
        setTimeout(function() {
            $body.addClass("noScroll");
            $el.show();
        });
    }

    function hideOverlay($el) {
        $body.removeClass('noScroll');
        $el.hide();
    }    
    
    $.fn.overlay = $.fn.overlay = function(action) {
      switch (action) {
        case "show":
          showOverlay(this);
          break;
        case "hide":
          hideOverlay(this);
          break;
        default:
          throw new Exception("Unknown action. Either use show or hide.");
      }
      return this;
    };

})()

