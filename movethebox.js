var mb = {};

mb.state = [new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7)];
mb.todo = [new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7)];
mb.boxToBeSwaped = [];
mb.isMoving = 0;

mb.transitionEvent = (function () {
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd',
        'animationstart': 'animationend',
        'webkitAnimationStart': 'webkitAnimationEnd',
        'MSAnimationStart': 'MSAnimationEnd'
    };
    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
})();

mb.swap = function (si, sj, ei, ej) {
    if (si < 0 || sj < 0 || ei < 0 || ej < 0 || si > 8 || sj > 6 || ei > 8 || ej > 6)
        return;
    var s = document.getElementsByClassName('b' + si + sj)[0];
    var e = document.getElementsByClassName('b' + ei + ej)[0];
    var sClass = s.className;
    var eClass = e.className;
    s.className = sClass.replace('b' + si + sj, 'b' + ei + ej);
    e.className = eClass.replace('b' + ei + ej, 'b' + si + sj);
    var sCallBack = s.getAttribute('onclick');
    var eCallBack = e.getAttribute('onclick');
    s.setAttribute('onclick', sCallBack.replace(si + ',' + sj, ei + ',' + ej));
    e.setAttribute('onclick', eCallBack.replace(ei + ',' + ej, si + ',' + sj));
    var temp = mb.state[si][sj];
    mb.state[si][sj] = mb.state[ei][ej];
    mb.state[ei][ej] = temp;
};

mb.isStable = function () {
    for (var j = 0; j < 7; j++) {
        var isEmpty = false;
        for (var i = 0; i < 9; i++) {
            if (mb.state[i][j] === 0)
                isEmpty = true;
            else if (isEmpty)
                return false;
        }
    }
    return true;
};

mb.fallDown = function () {
    for (var j = 0; j < 7; j++) {
        var empthNum = 0;
        for (var i = 0; i < 9; i++) {
            if (mb.state[i][j] === 0)
                empthNum++;
            else if (empthNum > 0) {
                mb.swap(i, j, i - empthNum, j);
            }
        }
    }
};

mb.check = function () {
    var checkSuccess = true;
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 5; j++)
            if (mb.state[i][j] !== 0 && mb.state[i][j] === mb.state[i][j + 1] && mb.state[i][j] === mb.state[i][j + 2]) {
                mb.todo[i][j] = 1;
                mb.todo[i][j + 1] = 1;
                mb.todo[i][j + 2] = 1;
                checkSuccess = false;
            }

    for (j = 0; j < 7; j++)
        for (i = 0; i < 7; i++)
            if (mb.state[i][j] !== 0 && mb.state[i][j] === mb.state[i + 1][j] && mb.state[i][j] === mb.state[i + 2][j]) {
                mb.todo[i][j] = 1;
                mb.todo[i + 1][j] = 1;
                mb.todo[i + 2][j] = 1;
                checkSuccess = false;
            }
    return checkSuccess;
};

mb.destoryBox = function () {
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 7; j++) {
            if (mb.todo[i][j]) {
                mb.state[i][j] = 0;
                mb.todo[i][j] = 0;
                var e = document.getElementsByClassName('b' + i + j)[0];
                var eClass = e.className;
                e.className = eClass.replace(/ [a-z]/, "");
            }
        }
};

mb.swapByHand = function (i, j) {
    if (mb.boxToBeSwaped.length) {
        var oi = mb.boxToBeSwaped[0];
        var oj = mb.boxToBeSwaped[1];
        if ((i - oi) * (i - oi) + (j - oj) * (j - oj) === 1) {
            document.getElementById("containbox").className = "wait";
            var ee = document.getElementsByClassName('b' + oi + oj)[0];
            mb.isMoving++;
            ee.style.boxShadow = "";
            mb.swap(oi, oj, i, j);

            var timeout = 350;
            var moving = function () {
                if (!mb.isStable()) {
                    mb.fallDown();
                    setTimeout(moving, timeout);
                }
                else if (!mb.check()) {
                    mb.destoryBox();
                    setTimeout(moving, timeout);
                }
                else {
                    mb.isMoving = 0;
                    ee.style = "";
                    document.getElementById("containbox").className = "pointer";

                }
            };
            setTimeout(moving, timeout);
        }
        else
            document.getElementsByClassName('b' + oi + oj)[0].style = "";
        mb.boxToBeSwaped = [];
    }
    else {
        mb.boxToBeSwaped = [i, j];
        var e = document.getElementsByClassName('b' + i + j)[0];
        var color;
        if (window.getComputedStyle) {
            color = window.getComputedStyle(e).backgroundColor;
        }
        else {
            color = e.currentStyle.backgroundColor;
        }
        e.style.boxShadow = "0 0 3px 3px " + color;
        e.style.zIndex = 1;
    }
};

mb.init = function (puzzle) {
    var skip = 0;
    var col = 0;
    var row = 0;
    for (var i = 0; i < puzzle.length; i++) {
        if (isNaN(puzzle[i])) {
            if (puzzle[i] === '#') {
                col += skip > 0 ? skip : 1;
                skip = 0;
            }
            else if (puzzle[i] === '!') {
                break;
            }
            else if (puzzle[i] === '$') {
                col = 0;
                row++;
                skip = 0;
            }
            else {
                for (var j = 0; j < (skip > 0 ? skip : 1); j++) {
                    var e = document.getElementsByClassName('b' + row + col);
                    if (e.length > 0) {
                        e[0].className += ' ' + puzzle[i];
                        mb.state[row][col] = puzzle[i].charCodeAt(0) - 96;
                        e[0].setAttribute("cursor", "set");
                        col++;
                    }
                }
                skip = 0;
            }
        }
        else {
            skip *= 10;
            skip += puzzle[i] - '0';
        }
    }
    if (!mb.isStable()) {
        mb.fallDown();
    }
};

window.onload = function () {
    mb.init("2#a2bc$2#2acb$2#b2a$3#2b$4#c$4#a!");
};