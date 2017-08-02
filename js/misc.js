(function($) {
  $(function() {
    $('#sidebar .nav').perfectScrollbar();
    $('.container-scroller').perfectScrollbar( {suppressScrollX: true});
    $('[data-toggle="minimize"]').on("click", function () {
      $('body').toggleClass('sidebar-icon-only');
    });
  });
})(jQuery);
