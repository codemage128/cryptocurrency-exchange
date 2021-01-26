(function($){
	"use strict";

	$(window).on ('load', function (){

        // Header Sticky
		$(window).on('scroll',function() {
            if ($(this).scrollTop() > 120){
                $('.navbar-area').addClass("is-sticky");
            }
            else{
                $('.navbar-area').removeClass("is-sticky");
            }
        });

        // WOW JS intialize
        if ($(".wow").length) {
            var wow = new WOW({
                boxClass:     'wow',      // animated element css class (default is wow)
                animateClass: 'animated', // animation css class (default is animated)
                offset:       20,          // distance to the element when triggering the animation (default is 0)
                mobile:       true, // trigger animations on mobile devices (default is true)
                live:         true,       // act on asynchronously loaded content (default is true)
            });
            wow.init();
        }

        // FAQ Accordion
        $(function() {
            $('.accordion').find('.accordion-title').on('click', function(){
                // Adds Active Class
                $(this).toggleClass('active');
                // Expand or Collapse This Panel
                $(this).next().slideToggle('fast');
                // Hide The Other Panels
                $('.accordion-content').not($(this).next()).slideUp('fast');
                // Removes Active Class From Other Titles
                $('.accordion-title').not($(this)).removeClass('active');
            });
        });

        // Nice Select JS
        $('select').niceSelect();
        
        $("#navbarSupportedContent").on('show.bs.collapse', function() {
            $('a.nav-link').click(function() {
                $("#navbarSupportedContent").collapse('hide');
            });
        });

        // Scroll Event for Go To Top Visible
        $(window).on('scroll', function(){
            var scrolled = $(window).scrollTop();
            if (scrolled > 600) $('.go-top').addClass('active');
            if (scrolled < 600) $('.go-top').removeClass('active');
        });

        // Go To Top
        $('.go-top').on('click', function() {
            $("html, body").animate({ scrollTop: "0" },  500);
        });

        // Preloader
        $('.preloader').fadeOut();
	});
}(jQuery));
