(function($) {
  'use strict';
  $(document).on('mouseenter mouseleave', '.sidebar .nav-item', function (ev) {
      var body = $('body');
      var sidebarIconOnly = body.hasClass("sidebar-icon-only");
      if(!('ontouchstart' in document.documentElement)) {
        if(sidebarIconOnly) {
          var $menuItem = $(this),
          $menuTitle = $('.menu-title', $menuItem),
          $submenuWrapper = $('> .collapse', $menuItem);
          if(ev.type === 'mouseenter') {
            $menuTitle.addClass('show');
            $submenuWrapper.addClass('show');
          }
          else {
            $menuTitle.removeClass('show');
            $submenuWrapper.removeClass('show');
          }
        }
      }

  });
})(jQuery);
