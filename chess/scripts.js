/* vars */
const FIGURESYMBOL = {
    king: {
        white: '&#9812;',
        black: '&#9818;'
    },
    queen: {
        white: '&#9813;',
        black: '&#9819;'
    },
    rook: {
        white: '&#9814;',
        black: '&#9820;'
    },
    bishop: {
        white: '&#9815;',
        black: '&#9821;'
    },
    knight: {
        white: '&#9816;',
        black: '&#9822;'
    },
    pawn: {
        white: '&#9817;',
        black: '&#9823;'
    }
};
const CHECKER = {
    king(a, b) {
        return (Math.abs(a.x - b.x) <= 1) && (Math.abs(a.y - b.y) <= 1);
    },
    queen(a, b) {
        return CHECKER.rook(a, b) || CHECKER.bishop(a, b);
    },
    rook(a, b) {
        if ((a.x == b.x) || (a.y == b.y)) {
            if (Math.abs(a.x - b.x + a.y - b.y) == 1) {
                return true;
            }
            if (a.x == b.x) {
                if (a.y < b.y) {
                    start = a.y + 1;
                    stop = b.y;
                } else {
                    start = b.y + 1;
                    stop = a.y;
                }
                for (let i = start; i < stop; i++) {
                    if (getFigure(getPositionFromCoords(a.x, i))) return false;
                }
            } else {
                if (a.x < b.x) {
                    start = a.x + 1;
                    stop = b.x;
                } else {
                    start = b.x + 1;
                    stop = a.x;
                }
                for (let i = start; i < stop; i++) {
                    if (getFigure(getPositionFromCoords(i, a.y))) return false;
                }
            }
            return true;
        } else {
            return false;
        }
    },
    bishop(a, b) {
        if ((a.x + a.y == b.x + b.y) || (a.x - a.y == b.x - b.y)) {
            if (Math.abs(a.x - b.x) + Math.abs(a.y - b.y) == 2) {
                return true;
            }
            if (a.x + a.y == b.x + b.y) {
                if (a.x > b.x) {
                    start = b.x + 1;
                    stop = a.x;
                } else {
                    start = a.x + 1;
                    stop = b.x;
                }
                for (let i = start; i < stop; i++) {
                    if (getFigure(getPositionFromCoords(i, a.x + a.y - i))) return false;
                }
            } else {
                if (a.x > b.x) {
                    start = b.x + 1;
                    stop = a.x;
                } else {
                    start = a.x + 1;
                    stop = b.x;
                }
                for (let i = start; i < stop; i++) {
                    if (getFigure(getPositionFromCoords(i, i - b.x + b.y))) return false;
                }
            }
            return true;
        } else {
            return false;
        }
    },
    knight(a, b) {
        return ((Math.abs(a.x - b.x) == 1) && (Math.abs(a.y - b.y) == 2)) || ((Math.abs(a.x - b.x) == 2) && (Math.abs(a.y - b.y) == 1));
    },
    whitepawn(a, b) { // TODO сделать проверку правильности хода
        return false;
    },
    whitepawnbeat(a, b) { // TODO сделать проверку правильности хода
        return false;
    },
    blackpawn(a, b) { // TODO сделать проверку правильности хода
        return false;
    },
    blackpawnbeat(a, b) { // TODO сделать проверку правильности хода
        return false;
    }
};
let figureset = [];
let startPosition = [
    'king white e1',
    'king black e8',
    'queen white d1',
    'queen black d8',
    'rook white a1',
    'rook white h1',
    'rook black a8',
    'rook black h8',
    'bishop white c1',
    'bishop white f1',
    'bishop black c8',
    'bishop black f8',
    'knight white b1',
    'knight white g1',
    'knight black b8',
    'knight black g8',
    'pawn white a2',
    'pawn white b2',
    'pawn white c2',
    'pawn white d2',
    'pawn white e2',
    'pawn white f2',
    'pawn white g2',
    'pawn white h2',
    'pawn black a7',
    'pawn black b7',
    'pawn black c7',
    'pawn black d7',
    'pawn black e7',
    'pawn black f7',
    'pawn black g7',
    'pawn black h7'
];

/* functions */
function getCellSelector(cellName, line=true) {
    const letters = '  abcdefgh';
    let x = letters.indexOf(cellName.toLowerCase()[0]);
    let y = 10 - cellName[1];
    if (line) {
        return `.tr:nth-child(${y}) .td:nth-child(${x})`;
    } else {
        return {x, y};
    }
}

function getPositionFromCoords(x, y) {
    const letters = '  abcdefgh';
    let letter = letters[x];
    let digit = 10 - y;
    return letter + digit;
}

function getPosition(cell) {
    const letters = ' abcdefgh';
    let tr = cell.parentNode;
    let letter = letters[Array.from(tr.children).indexOf(cell)];
    let digit = 9 - Array.from(tr.parentNode.children).indexOf(tr);
    return letter + digit;
}

function getFigure(cellName) {
    for (f of figureset) {
        if (f.position == cellName) {
            return f;
        }
    }
    return null;
}

function checkMove(pos1, pos2, fig, beat=false) {
    let a = getCellSelector(pos1, false);
    let b = getCellSelector(pos2, false);
    let action = CHECKER[fig.name];
    if (fig.name == 'pawn') {
        if (fig.color == 'white') {
            if (beat) {
                action = CHECKER['whitepawnbeat'];
            } else {
                action = CHECKER['whitepawn'];
            }
        } else {
            if (beat) {
                action = CHECKER['blackpawnbeat'];
            } else {
                action = CHECKER['blackpawn'];
            }
        }
    } else if ((fig.name == 'king') && (fig.nomoves)) {
        let res = null;
        if (fig.color == 'white') {
            if (pos2 == 'g1') {
                res = getFigure('h1');
                if (res.nomoves && (res.name == 'rook') && (res.color == 'white')) {
                    // TODO проверить промежуточные поля, переставить ладью на 'f1' и вернуть true
                    //return true;
                }
            } else if (pos2 == 'c1') {
                res = getFigure('a1');
                if (res.nomoves && (res.name == 'rook') && (res.color == 'white')) {
                    // TODO проверить промежуточные поля, переставить ладью на 'd1' и вернуть true
                    //return true;
                }
            }
        } else if (fig.color == 'black') {
            if (pos2 == 'g8') {
                res = getFigure('h8');
                if (res.nomoves && (res.name == 'rook') && (res.color == 'black')) {
                    // TODO проверить промежуточные поля, переставить ладью на 'f8' и вернуть true
                    //return true;
                }
            } else if (pos2 == 'c8') {
                res = getFigure('a8');
                if (res.nomoves && (res.name == 'rook') && (res.color == 'black')) {
                    // TODO проверить промежуточные поля, переставить ладью на 'd8' и вернуть true
                    //return true;
                }
            }
        }
    }
    return action(a, b);
}

function ChessFigure(name, color, position) {
    this.name = name;
    this.color = color;
    this.position = position.toLowerCase();
    this.nomoves = false;
    this.render = function(){
        document.querySelector(getCellSelector(this.position)).innerHTML = FIGURESYMBOL[this.name][this.color];
    };
    this.clear = function(){
        document.querySelector(getCellSelector(this.position)).innerHTML = '';
    };
    if (this.name == 'king') {
        if (((this.color == 'white') && (this.position == 'e1')) || ((this.color == 'black') && (this.position == 'e8'))) this.nomoves = true;
    } else if (this.name == 'rook') {
        if (((this.color == 'white') && (this.position in ['a1', 'h1'])) || ((this.color == 'black') && (this.position in ['a8', 'h8']))) this.nomoves = true;
    }
}

function makeFigure(name, color, position) {
    let fig = new ChessFigure(name, color, position);
    fig.render();
    figureset.push(fig);
}

function startUp(pos) {
    for (i of pos) {
        let j = i.split(' ');
        makeFigure(j[0], j[1], j[2]);
    }
}

function move(beat=false) {
    let start = document.querySelector('.start');
    let finish = document.querySelector('.finish');
    start.classList.remove('start');
    finish.classList.remove('finish');
    let pos1 = getPosition(start);
    let pos2 = getPosition(finish);
    let fig;
    fig = getFigure(pos1);
    if (beat) {
        let beatfig = getFigure(pos2);
        if (beatfig.color != fig.color) {
            if (checkMove(pos1, pos2, fig, true)) {
                figureset.splice(figureset.indexOf(beatfig), 1);
                fig.clear();
                fig.position = pos2;
                fig.render();
                fig.nomoves = false;
                console.log(fig.color, fig.name, pos1, 'beat', pos2);
            }
        }
    } else {
        if (checkMove(pos1, pos2, fig)) {
            fig.clear();
            fig.position = pos2;
            fig.render();
            fig.nomoves = false;
            console.log(fig.color, fig.name, pos1, 'walk', pos2);
        }
    }
}

/* main */
document.addEventListener('DOMContentLoaded', function() {
    startUp(startPosition);
    
    document.querySelectorAll('.td').forEach(item => item.addEventListener('click', function(){
        if (document.querySelector('.start')) {
            if (document.querySelector('.finish')) {
                document.querySelector('.start').classList.remove('start');
                document.querySelector('.finish').classList.remove('finish');
                if (this.innerHTML) this.classList.add('start');
            } else {
                if (this.classList.contains('start')) {
                    this.classList.remove('start');
                } else {
                    this.classList.add('finish');
                    if (!this.innerHTML) {
                        move();
                    } else {
                        move(true);
                    }
                }
            }
        } else {
            if (this.innerHTML) this.classList.add('start');
        }
    }));
    
});
