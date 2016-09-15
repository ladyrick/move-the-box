var mb = {};

mb.state = [new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7)];
mb.todo = [new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7)];
mb.boxToBeSwaped = [];

mb.swap = function (si, sj, ei, ej) {
    if (si < 0 || sj < 0 || ei < 0 || ej < 0 || si > 8 || sj > 6 || ei > 8 || ej > 6)
        return;
    var s = document.getElementsByClassName('b' + si + sj)[0];
    var e = document.getElementsByClassName('b' + ei + ej)[0];
    s.style.zIndex = 1;
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
    s.style.zIndex = 0;
    e.style.zIndex = 0;
};

mb.hide = function (i, j) {
    if (i < 0 || j < 0 || i > 8 || j > 6)
        return;
    var e = document.getElementsByClassName('b' + i + j)[0];
    var eClass = e.className;
    e.className = eClass.replace(/ [a-z]/, "");

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
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 5; j++)
            if (mb.state[i][j] === mb.state[i][j + 1] && mb.state[i][j] === mb.state[i][j + 2]) {
                mb.todo[i][j] = 1;
                mb.todo[i][j + 1] = 1;
                mb.todo[i][j + 2] = 1;
            }


    for (j = 0; j < 7; j++)
        for (i = 0; i < 7; i++)
            if (mb.state[i][j] === mb.state[i + 1][j] && mb.state[i][j] === mb.state[i + 2][j]) {
                mb.todo[i][j] = 1;
                mb.todo[i + 1][j] = 1;
                mb.todo[i + 2][j] = 1;
            }

};

mb.swapByHand = function (i, j) {
    if (mb.boxToBeSwaped.length) {
        mb.swap(mb.boxToBeSwaped[0], mb.boxToBeSwaped[1], i, j);
        mb.boxToBeSwaped = [];
    }
    else {
        mb.boxToBeSwaped = [i, j];
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
                return;
            }
            else if (puzzle[i] === '$') {
                col = 0;
                row++;
                skip = 0;
            }
            else {
                var e = document.getElementsByClassName('b' + row + col);
                if (e.length > 0) {
                    e[0].className += ' ' + puzzle[i];
                    mb.state[row][col] = puzzle[i].charCodeAt(0) - 96;
                    skip = 0;
                    col++;
                }
            }
        }
        else {
            skip *= 10;
            skip += puzzle[i] - '0';
        }
    }
};

window.onload = function () {
    mb.init("3#aa$4#bcdefg$eqwfd!");
    if (!mb.isStable()) {
        mb.fallDown();
    }
};