let canvas = document.getElementById("chessboard");
let context = canvas.getContext("2d");

// Chess Piece Factory
class ChessPieceFactory {
    /**
     * Creates a chess piece based on the provided type, color, row, and column.
     * @param {string} type - The type of the chess piece (e.g., "rook", "knight").
     * @param {string} color - The color of the chess piece ("black" or "white").
     * @param {number} row - The row of the chess piece on the chessboard.
     * @param {number} col - The column of the chess piece on the chessboard.
     * @returns {ChessPiece} - The created chess piece.
     */
    static createPiece(type, color, row, col, board) {
        switch (type) {
            case "rook":
                return new Rook(color, row, col, board);
            case "knight":
                return new Knight(color, row, col, board);
            case "bishop":
                return new Bishop(color, row, col, board);
            case "queen":
                return new Queen(color, row, col, board);
            case "king":
                return new King(color, row, col, board);
            case "pawn":
                return new Pawn(color, row, col, board);
        }
        // Add more piece types as needed
    }
}

class ChessPiece {
    _board = undefined;
    _color = 'white';
    _name = "";

    position = {
        current: {row: undefined, col: undefined },
        old: { col: undefined, row: undefined },
    };

    atPosition(row, col) {
        this.setBoardPosition(row, col);

        return this;
    }

    asBlack() {
        this._color = 'black';

        return this;
    }

    withBoard(board) {
        this._board = board;

        return this;
    }

    setBoardPosition(row, col) {
        this.position.old.row = typeof this.position.old.row === 'undefined' ? row : this.position.current.row;
        this.position.old.col = typeof this.position.old.col === 'undefined' ? row : this.position.current.col;

        this.position.current.row = row;
        this.position.current.col = col;
    }

    setPiecePosition_string(newPosition) {
        const col = newPosition.charAt(0).toUpperCase();
        const row = parseInt(newPosition.charAt(1));

        if (isNaN(row) || row < 1 || row > 8 || column < "A" || column > "H") {
            throw new Error("Invalid chess square");
        }

        return { col: col, row: row };
    }

    draw() {
        context.fillStyle = "red";
        context.font = "BOLD 100px";

        let {x, y} = this.getPosition();

        context.fillText(
            this._name,
            x,
            y
        );
    }

    getPosition() {
        return this._board.getPosition(this.position.current.col, this.position.current.row)
    }
}

class Rook extends ChessPiece {
    _name = "Rook";
}

class Knight extends ChessPiece {
    _name = "Knight";
}

class Bishop extends ChessPiece {
    _name = "Bishop";
}

class Queen extends ChessPiece {
    _name = "Queen";
}

class King extends ChessPiece {
    _name = "King";
}
class Pawn extends ChessPiece {
    _name = "Pawn";
}

class boardSquare {
    constructor(color, row, col) {
        this._color = color;
        this._row = row;
        this._col = col;
        this._rowPos = NaN;
        this._colPos = NaN;
        this._name = "";
    }
}

class Chessboard {
    constructor() {
        canvas.addEventListener("mousemove", this.mouseTracker.bind(this));

        this.frameSize = 90;
        this.boardSize = 8;
        this.boardWidth = canvas.width - this.frameSize * 2;
        this.boardHeight = this.boardWidth;
        this.squareSize = this.boardWidth / this.boardSize;
        this.boardIndex = {
            horizontal: ["A", "B", "C", "D", "E", "F", "H", "G"],
            vertical: ["1", "2", "3", "4", "5", "6", "7", "8"],
        };
        this.squareColor = ["#7a8285", "#222"];

        this.observers = [];
        this.pieces = [];
        this.squars = [];

        this.init();
        this.draw();
    }

    addPieces(pieces) {
        this.pieces.push(...pieces.map(piece => {
            return piece.withBoard(this);
        }))

        return this;
    }

    init() {
        let blackPieces = [
            new Rook,
            new Knight,
            new Bishop,
            new Queen,
            new King,
            new Bishop,
            new Knight,
            new Rook,
        ].map((piece, index) => {
            return piece.atPosition(0, index).asBlack();
        });

        this.addPieces(blackPieces);
    }

    draw() {
        this.drawChessboard(
            this.boardSize,
            this.squareSize,
            this.frameSize,
            this.boardIndex
        );
        this.drawPieces();
    }

    getPosition(col, row) {
        const frameSize = this.frameSize;
        const squareSize = this.squareSize;

        const boardSize = squareSize * this.boardSize;

        return {
            x: frameSize + col * squareSize + squareSize / 2,
            y: frameSize + boardSize - (row * squareSize + squareSize / 2),
        }
    }

    drawChessboard(boardSize, squareSize, frameSize, boardIndex) {
        // Draw frame
        let textOfset = 33;

        let collomnPos = frameSize + squareSize / 2;
        let textColor = "black";
        for (var i = 0; i < boardSize; i++) {
            context.font = "bold 30px serif";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = textColor;
            context.fillText(
                boardIndex.horizontal[i],
                collomnPos + i * squareSize,
                frameSize - textOfset
            );
            context.fillText(
                boardIndex.horizontal[i],
                collomnPos + i * squareSize,
                frameSize + this.boardHeight + textOfset
            );
            context.fillText(
                8 - i,
                frameSize - textOfset,
                collomnPos + i * squareSize
            );
            context.fillText(
                boardIndex.vertical[7 - i],
                frameSize + this.boardHeight + textOfset,
                collomnPos + i * squareSize
            );
        }
        // Draw board
        for (var row = 0; row < boardSize; row++) {
            for (var col = 0; col < boardSize; col++) {
                context.fillStyle =
                    (row + col) % 2 === 0
                        ? this.squareColor[0]
                        : this.squareColor[1];
                context.fillRect(
                    frameSize + row * squareSize,
                    frameSize + col * squareSize,
                    squareSize,
                    squareSize
                );
            }
        }
    }

    drawPieces() {
        let index = 0;
        for (const piece in this.pieces) {
            this.pieces[piece].draw();
        }
        //
        // or
        //
        // for (const piece of this.pieces) {
        //     piece.draw();
        // }
    }

    getSquareName(row, col) {
        if (col < 1 || row < 1) {
            console.log("out of range");
            return null;
        }
        if (col > 8 || row > 8) {
            console.log("out of range");
            return null;
        }
        console.log(
            row - 1,
            col - 1,
            this.boardIndex.horizontal[col - 1] +
                this.boardIndex.vertical[8 - row]
        );
        return (
            this.boardIndex.horizontal[col - 1] +
            this.boardIndex.vertical[8 - row]
        );
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    notifyObservers() {
        for (const observer of this.observers) {
            observer.update();
        }
    }

    mouseTracker(event) {
        this._mouseX = event.clientX;
        this._mouseY = event.clientY;
        // this._debugData = this.getDebugData();
        // console.log(this.getDebugData());
        // this.drawOnDisplay(this._debugData);
        this.notifyObservers();
    }
}

class Debugger {
    constructor(chessboard) {
        this._chessboard = chessboard;
        this.showDebugger = true;
        if (this.showDebugger) {
            this._chessboard.addObserver(this); // adding debugger as observer to chessboard.
            // this.drawOnDisplay();
        }
    }

    // Update when notifyid from subject (the observed object)
    update() {
        // console.log("debuger notifide!!");
        const debugData = this.getDebugData();
        this.drawOnDisplay(debugData);
    }

    drawOnDisplay(debugData) {
        let fontSize = 20;
        let debugHeight = debugData.length * fontSize;
        let debugWidth = 300;

        // Draw debug window
        context.fillStyle = "gray";
        context.fillRect(
            0,
            canvas.height - debugHeight,
            debugWidth,
            debugHeight
        );

        // Draw debug text
        context.fillStyle = "black";
        context.font = `bold ${fontSize}px serif`;
        context.textAlign = "left";
        context.textBaseline = "top";
        let lines = debugData.length;
        let lineHeight = debugHeight / lines;
        for (var line = 0; line < debugData.length; line++) {
            context.fillText(
                debugData[line],
                0,
                canvas.height - debugHeight + 1 + lineHeight * line,
                debugWidth
            );
        }
    }

    getDebugData() {
        let boxPosition = canvas.getBoundingClientRect();
        let boxX = this._chessboard._mouseX - boxPosition.left;
        let boxY = this._chessboard._mouseY - boxPosition.top;
        let squareSize = this._chessboard.squareSize;
        let row = Math.floor(boxY / squareSize);
        let col = Math.floor(boxX / squareSize);
        let squareName = this._chessboard.getSquareName(row, col);
        let observers = this._chessboard.observers;

        return [
            `canvas.width ${canvas.width}`,
            `canvas.height ${canvas.height}`,
            `boxPosition.left: ${boxPosition.left}`,
            `boxPosition.top: ${boxPosition.top}`,
            `clientX: ${this._mouseX}`,
            `clientY: ${this._mouseY}`,
            `boxX: ${boxX}`,
            `boxY: ${boxY}`,
            `Square: ${squareName}`,
            `observers: ${observers.length}`,
        ];
    }
}

const chessboardw = new Chessboard();

const appDebugger = new Debugger(chessboardw);
