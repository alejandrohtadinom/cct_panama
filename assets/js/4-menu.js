menuBtn.click(function () {

    $(this).toggleClass('open');

    menu.toggleClass('active');

    menuItem.click(function () {

        menu.removeClass('active');

    });
    
});