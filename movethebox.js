var mb = {};

mb.state = [new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7)];
mb.todo = [new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7)];
mb.boxToBeSwaped = [];
mb.isMoving = false;
mb.solution = [];
mb.placeMode = false;
mb.stepLimit = 0;
mb.currentColor = "a";

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

mb.placeBox = function (i, j) {
    switch (event.button) {
        case 0: {
            document.getElementById('b' + i + j).className = mb.currentColor;
            mb.state[i][j] = mb.currentColor.charCodeAt(0) - 96;
            break;
        }
        case 1: {
            document.getElementById('b' + i + j).removeAttribute("class");
            mb.state[i][j] = 0;
            break;
        }
        case 2: {
            if (mb.state[i][j] === 0)
                mb.currentColor = String.fromCharCode((mb.currentColor.charCodeAt(0) - 97 + 1) % 12 + 97);
            else
                mb.currentColor = document.getElementById('b' + i + j).className;
            break;
        }
        default:
    }
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

mb.getSolution = function (state, steplimit) {
    var solved = true;
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 7; j++)
            if (state[i][j] !== 0)
                solved = false;
    if (solved)
        return true;
    else {
        if (steplimit === 0)
            return false;
        var swap = function (i1, j1, i2, j2) {
            if (i1 > 8 || j1 > 6 || i2 > 8 || j2 > 6 || state[i1][j1] === state[i2][j2])
                return [];
            var temp;
            var tempstate = [];
            state.forEach(function (t) {
                tempstate.push(t.slice())
            });
            temp = tempstate[i1][j1];
            tempstate[i1][j1] = tempstate[i2][j2];
            tempstate[i2][j2] = temp;
            return tempstate;
        };
        var todo = [new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7), new Int8Array(7)];
        for (i = 0; i < 9; i++)
            for (j = 0; j < 7; j++) {
                var d = [[1, 0], [0, 1]];
                for (var k = 0; k < 2; k++) {
                    var temp = swap(i, j, i + d[k][0], j + d[k][1]);
                    if (temp.length === 0) {
                        continue;
                    }
                    var finish = false;
                    while (!finish) {
                        finish = true;
                        if (!mb.isStable(temp)) {
                            (function () {
                                for (var j = 0; j < 7; j++) {
                                    var empthNum = 0;
                                    for (var i = 0; i < 9; i++) {
                                        if (temp[i][j] === 0)
                                            empthNum++;
                                        else if (empthNum > 0) {
                                            temp[i - empthNum][j] = temp[i][j];
                                            temp[i][j] = 0;
                                        }
                                    }
                                }
                            })();
                            finish = false;
                        }
                        else if (!mb.check(temp, todo)) {
                            (function () {
                                for (var i = 0; i < 9; i++)
                                    for (var j = 0; j < 7; j++) {
                                        if (todo[i][j]) {
                                            temp[i][j] = 0;
                                            todo[i][j] = 0;
                                        }
                                    }
                            })();
                            finish = false;
                        }
                    }
                    if (mb.getSolution(temp, steplimit - 1)) {
                        mb.solution.push([i, j, i + d[k][0], j + d[k][1]]);
                        return true;
                    }
                }
            }
    }
    return false;
};

mb.onmousedownfunc = function (i, j) {
    if (mb.isMoving)
        return;
    if (mb.placeMode)
        mb.placeBox(i, j);
    else
        mb.swapByHand(i, j);
};

mb.autoSolve = function () {
    if (mb.isMoving)
        return "is moving.";
    var solved = true;
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 7; j++)
            if (mb.state[i][j] !== 0)
                solved = false;
    if (solved)
        return "already solved";
    for (i = 1; i < 5; i++) {
        if (mb.getSolution(mb.state, i))
            break;
    }
    if (i === 5)
        return "unsolveable;";
    else
        mb.stepLimit = i;
    mb.isMoving = true;
    document.getElementById("containbox").className = "wait";
    var timeout = 350;
    var l = mb.solution.length - 1;
    var finish = true;
    var moving = function () {
        if (finish) {
            mb.swap(mb.solution[l][0], mb.solution[l][1], mb.solution[l][2], mb.solution[l][3]);
            l--;
            mb.solution.pop();
            finish = false;
            setTimeout(moving, timeout);
        }
        else if (!mb.isStable(mb.state)) {
            mb.fallDown();
            setTimeout(moving, timeout);
        }
        else if (!mb.check(mb.state, mb.todo)) {
            mb.destoryBox();
            setTimeout(moving, timeout);
        }
        else if (l >= 0) {
            finish = true;
            setTimeout(moving, timeout);
        }
        else {
            mb.isMoving = false;
            document.getElementById("containbox").className = "pointer";
        }
    };
    moving();
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
