(function($) {
  $(document).on('mouseenter mouseleave', '.sidebar .nav-item', function (ev) {
      sidebarMini = $('body').hasClass("sidebar-mini");
      sidebarIconOnly = $('body').hasClass("sidebar-icon-only");
      horizontalMenu = $('body').hasClass("horizontal-menu");
      horizontalMenuTop = $('body').hasClass("horizontal-menu-top");
      boxedLayout = $('body').hasClass("boxed-layout");
      rtlLayout = $('body').hasClass("rtl");
      if (sidebarMini || sidebarIconOnly || horizontalMenu) {
        var $menuItem = $(this),
        $submenuWrapper = $('> .collapse', $menuItem);
        if(ev.type === 'mouseenter') {
          $submenuWrapper.addClass('show');
          // grab the menu item's position relative to its positioned parent
          var menuItemPos = $menuItem.offset();
          // place the submenu in the correct position relevant to the menu item
          if(horizontalMenu) {
            if(horizontalMenuTop) {
              if(rtlLayout) {
                $submenuWrapper.css({
                    top: menuItemPos.top+$menuItem.height(),
                    left: menuItemPos.left,
                    minWidth: $menuItem.outerWidth()
                });
              }
              else {
                $submenuWrapper.css({
                    top: menuItemPos.top+$menuItem.height(),
                    left: menuItemPos.left - $('.navbar-brand-wrapper').outerWidth(),
                    minWidth: $menuItem.outerWidth()
                });
              }
            }
            else {
              $submenuWrapper.css({
                  top: menuItemPos.top+$menuItem.height(),
                  left: menuItemPos.left,
                  minWidth: $menuItem.outerWidth()
              });
            }
          }
          else {
            if(menuItemPos.top>=$('.sidebar').height()/2){
              $submenuWrapper.css({
                  top: menuItemPos.top+$menuItem.height()- $(window).scrollTop()-$submenuWrapper.height()
              });
            }
            else {
              $submenuWrapper.css({
                  top: menuItemPos.top- $(window).scrollTop()
              });
            }
            if(boxedLayout) {
              if(rtlLayout) {
                $submenuWrapper.css({
                  right: $menuItem.outerWidth() + $('.container-scroller').css('padding-right')
                });
              }
              else {
                $submenuWrapper.css({
                  left: menuItemPos.left + Math.round($menuItem.outerWidth()-$('.container-scroller').css('padding-left'))
                });
              }
            }
            else {
              if(rtlLayout) {
                $submenuWrapper.css({
                  right: $menuItem.outerWidth()
                });
              }
              else {
                $submenuWrapper.css({
                  left: menuItemPos.left + Math.round($menuItem.outerWidth())
                });
              }
            }
          }
        }
        else {
          $submenuWrapper.removeClass('show');
        }
      }
  });
})(jQuery);
