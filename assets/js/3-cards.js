cursoImgH = cursoImg.height();

cursoFig.css({
    'height' : cursoImgH + 'px'
});

$(window).resize(function () {
    cursoImgH = cursoImg.height();

    cursoFig.css({
        'height' : cursoImgH + 'px'
    });
});