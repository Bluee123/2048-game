/*主逻辑*/
var board = new Array();
var score = 0;
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function() {
    newgame();
})

function newgame() {
    //初始化棋盘格
    init();
    //再随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }

    /*初始化数组 */
    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView(); //更新界面
    score = 0;
}

function updateBoardView() {
    $(".number-cell").remove(); //如果当前有这个属性 则移除
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $('#number-cell-' + i + '-' + j);

            if (board[i][j] == 0) {
                /*设置长宽为0 放在grid-cell中间 */
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + 50);
                theNumberCell.css('left', getPosLeft(i, j) + 50);
            } else {
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                /*根据board[i][j]的值决定number-cell的背景色以及输出的字的颜色 */
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }

            hasConflicted[i][j] = false;
        }
    }
}

function generateOneNumber() {
    if (nospace(board))
        return false;

    //随机一个位置
    var rand1 = parseInt(Math.floor(Math.random() * 4)); //下取整
    var rand2 = parseInt(Math.floor(Math.random() * 4));

    var times = 0;
    while (true < 50) {
        if (board[rand1][rand2] == 0) //如果这个位置等于0 则可用 不等于0 则再次生成新的坐标 直到那个坐标为0
            break;

        rand1 = parseInt(Math.floor(Math.random() * 4));
        rand2 = parseInt(Math.floor(Math.random() * 4));

        times++;
    }
    if (times == 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    rand1 = i;
                    rand2 = j;
                }
            }
        }
    }
    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;
    //在随机位置显示随机位置
    board[rand1][rand2] = randNumber;
    showNumberWithAnimation(rand1, rand2, randNumber);
    return true;
}

$(document).keydown(function(event) {
    switch (event.keyCode) {
        case 37: //left
            event.preventDefault();
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 38: //up
            event.preventDefault();
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 39: //right
            event.preventDefault();
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        case 40: //down
            event.preventDefault();
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isgameover()", 300);
            }
            break;
        default: //default
            break;
    }
});

document.addEventListener('touchstart', function(event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchmove', function(event) {
    event.preventDefault();
});

document.addEventListener('touchend', function(event) {
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    var deltax = endx - startx;
    var deltay = endy - starty;

    if (Math.abs(deltax) < 0.3 * documentWidth && Math.abs(deltay) < 0.3 * documentWidth)
        return;

    if (Math.abs(deltax) >= Math.abs(deltay)) {
        if (deltax > 0) {
            //向右
            moveRight();
        } else {
            //向左
            moveLeft();
        }
    } else {
        if (deltay > 0) {
            //向下
            moveDown();
        } else {
            //向上
            moveUp();
        }
    }
});

function isgameover() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert('gameover!');
}

function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }
    //moveLeft
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;

                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 150);
    return true;
}

function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }
    //moveLeft
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockHorizontal2(j, k, i, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;

                    } else if (board[k][j] == board[i][j] && noBlockHorizontal2(j, k, i, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }

                }
            }
        }
    }
    setTimeout("updateBoardView()", 150);
    return true;
}

function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }
    //moveRight
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;

                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 150);
    return true;
}

function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }
    //moveDown
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockHorizontal2(j, i, k, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;

                    } else if (board[k][j] == board[i][j] && noBlockHorizontal2(j, i, k, board) && !hasConflicted[k][j]) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()", 150);
    return true;
}