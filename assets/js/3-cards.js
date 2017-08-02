cursoImgH = cursoImg.height();

if (cursoImgH > 0) {
    cursoFig.css({
        'height' : cursoImgH + 'px'
    });
}

$(window).resize(function () {
    cursoImgH = cursoImg.height();

    cursoFig.css({
        'height' : cursoImgH + 'px'
    });
});