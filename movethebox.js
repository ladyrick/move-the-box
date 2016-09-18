var mb = {};

mb.state = [new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7)];
mb.todo = [new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7)];
mb.boxToBeSwaped = [];
mb.isMoving = false;
mb.stepLimit = 0;

mb.swap = function (si, sj, ei, ej) {
    if (si < 0 || sj < 0 || ei < 0 || ej < 0 || si > 8 || sj > 6 || ei > 8 || ej > 6)
        return;
    var s = document.getElementById('b' + si + sj);
    var e = document.getElementById('b' + ei + ej);
    s.setAttribute('id', 'b' + ei + ej);
    e.setAttribute('id', 'b' + si + sj);
    s.setAttribute('onmousedown', 'mb.onmousedownfunc(' + ei + ',' + ej + ')');
    e.setAttribute('onmousedown', 'mb.onmousedownfunc(' + si + ',' + sj + ')');
    var temp = mb.state[si][sj];
    mb.state[si][sj] = mb.state[ei][ej];
    mb.state[ei][ej] = temp;
};

mb.isStable = function (state) {
    for (var j = 0; j < 7; j++) {
        var isEmpty = false;
        for (var i = 0; i < 9; i++) {
            if (state[i][j] === 0)
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

mb.check = function (state, todo) {
    var checkSuccess = true;
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 5; j++)
            if (state[i][j] !== 0 && state[i][j] === state[i][j + 1] && state[i][j] === state[i][j + 2]) {
                todo[i][j] = 1;
                todo[i][j + 1] = 1;
                todo[i][j + 2] = 1;
                checkSuccess = false;
            }
    for (j = 0; j < 7; j++)
        for (i = 0; i < 7; i++)
            if (state[i][j] !== 0 && state[i][j] === state[i + 1][j] && state[i][j] === state[i + 2][j]) {
                todo[i][j] = 1;
                todo[i + 1][j] = 1;
                todo[i + 2][j] = 1;
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
                var e = document.getElementById('b' + i + j);
                e.removeAttribute("class");
            }
        }
};

mb.onmousedownfunc = function (i, j) {
    if (mb.isMoving)
        return;
    mb.swapByHand(i, j);
};

mb.swapByHand = function (i, j) {
    if (mb.boxToBeSwaped.length) {
        var oi = mb.boxToBeSwaped[0];
        var oj = mb.boxToBeSwaped[1];
        if (mb.state[i][j] === 0 && mb.state[oi][oj] === 0) {
            mb.boxToBeSwaped = [i, j];
            return;
        }
        if ((i - oi) * (i - oi) + (j - oj) * (j - oj) === 1) {
            document.getElementById("containbox").className = "wait";
            var e1 = document.getElementById('b' + oi + oj);
            mb.isMoving = true;
            e1.style.boxShadow = "";
            mb.swap(oi, oj, i, j);

            var timeout = 350;
            var moving = function () {
                if (!mb.isStable(mb.state)) {
                    mb.fallDown();
                    setTimeout(moving, timeout);
                }
                else if (!mb.check(mb.state, mb.todo)) {
                    mb.destoryBox();
                    setTimeout(moving, timeout);
                }
                else {
                    mb.isMoving = false;
                    e1.style.zIndex = "";
                    document.getElementById("containbox").className = "pointer";
                }
            };
            setTimeout(moving, timeout);
        }
        else {
            e1 = document.getElementById('b' + oi + oj).style;
            e1.boxShadow = "";
            e1.zIndex = "";
        }
        mb.boxToBeSwaped = [];
    }
    else {
        mb.boxToBeSwaped = [i, j];
        if (mb.state[i][j] === 0)
            return;
        var color;
        var e2 = document.getElementById('b' + i + j);
        if (window.getComputedStyle) {
            color = window.getComputedStyle(e2).backgroundColor;
        }
        else {
            color = e2.currentStyle.backgroundColor;
        }
        e2.style.boxShadow = "0 0 3px 3px " + color;
        e2.style.zIndex = 1;
    }
};

mb.init = function (steplimit, puzzle) {
    mb.stepLimit = steplimit;
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
                var c = String.fromCharCode(puzzle[i].charCodeAt(0) % 12 + 97);
                for (var j = 0; j < (skip > 0 ? skip : 1); j++) {
                    var e = document.getElementById('b' + row + col);
                    if (typeof e !== "undefined") {
                        e.className += c;
                        mb.state[row][col] = c.charCodeAt(0) - 96;
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
    if (!mb.isStable(mb.state)) {
        mb.fallDown();
    }
};

window.onload = function () {
    mb.init(2, "2#a2bc$2#2acb$2#b2a$3#2b$4#c$4#a!");
};
