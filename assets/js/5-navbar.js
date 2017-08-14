var 
	navPos = navBar.offset().top,
	navH = navBar.height();

navBar.wrap('<div class="nav-wrap"></div>');
$(".nav-wrap").height(navH);

$(window).scroll(function () {

	wScroll = $(this).scrollTop();

	if (wScroll > navPos) {
		navBar.addClass("sticky");
	} else {
		navBar.removeClass("sticky");
	}

});