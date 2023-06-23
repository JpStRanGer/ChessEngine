let canvas = document.getElementById("chessboard");
let context = canvas.getContext("2d");
let canvasContainer = document.getElementById("canvas-container");
canvas.width = canvasContainer.clientWidth;
canvas.height = canvasContainer.clientHeight;

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
    static createPiece(type, color, row, col, boardSettings) {
        switch (type) {
            case "rook":
                return new Rook(color, row, col, boardSettings);
            case "knight":
                return new Knight(color, row, col, boardSettings);
            case "bishop":
                return new Bishop(color, row, col, boardSettings);
            case "queen":
                return new Queen(color, row, col, boardSettings);
            case "king":
                return new King(color, row, col, boardSettings);
            case "pawn":
                return new Pawn(color, row, col, boardSettings);
        }
        // Add more piece types as needed
    }
}

class ChessPiece {
    constructor(color, row, col, boardSettings) {
        this._boardSettings = boardSettings;
        this._position = this.setBoardPosition(row, col);
        this._color = color;
        this._type = "";
    }

    setBoardPosition(row, col) {
        const frameSize = this._boardSettings.frameSize;
        const squareSize = this._boardSettings.squareSize;
        return {
            current: {
                col: frameSize + col * squareSize + squareSize / 2,
                row: frameSize + row * squareSize + squareSize / 2,
            },
            old: { col: col, row: row },
        };
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
        context.fillStyle = "blue";
        context.font = "bold 20px serif";
        context.fillText(
            this._type,
            this._position.current.col,
            this._position.current.row
        );
    }
}

class Rook extends ChessPiece {
    constructor(color, row, col, boardSettings) {
        super(color, row, col, boardSettings);
        this._type = "Rook";
    }
}

class Knight extends ChessPiece {
    constructor(color, row, col, boardSettings) {
        super(color, row, col, boardSettings);
        this._type = "Knight";
    }
}

class Bishop extends ChessPiece {
    constructor(color, row, col, boardSettings) {
        super(color, row, col, boardSettings);
        this._type = "Bishop";
    }
}

class Queen extends ChessPiece {
    constructor(color, row, col, boardSettings) {
        super(color, row, col, boardSettings);
        this._type = "Queen";
    }
}

class King extends ChessPiece {
    constructor(color, row, col, boardSettings) {
        super(color, row, col, boardSettings);
        this._type = "King";
    }
}
class Pawn extends ChessPiece {
    constructor(color, row, col, boardSettings) {
        super(color, row, col, boardSettings);
        this._type = "Pawn";
    }
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

class BoardSettings {
    constructor() {
        this.frameSize = 90;
        this.numberOfSquares = 8;
        this.bordWidth = canvas.width - this.frameSize * 2;
        this.bordHeight = this.bordWidth;
        this.squareSize = this.bordWidth / this.numberOfSquares;
        this.boardIndex = {
            horizontal: ["A", "B", "C", "D", "E", "F", "H", "G"],
            vertical: ["1", "2", "3", "4", "5", "6", "7", "8"],
        };
        this.squareColor = ["#7a8285", "#222"];
    }
}

class Chessboard {
    constructor() {
        canvas.addEventListener("mousemove", this.mouseTracker.bind(this));

        this.boardSettings = new BoardSettings();
        this.squareColor = this.boardSettings.squareColor;
        this.boardIndex = this.boardSettings.boardIndex;
        this.frameSize = this.boardSettings.frameSize;
        this.boardSize = this.boardSettings.numberOfSquares;
        this.bordWidth = this.boardSettings.bordWidth;
        this.bordHeight = this.boardSettings.bordHeight;
        this.squareSize = this.boardSettings.squareSize;

        this.observers = [];
        this.pieces = [];
        this.squars = [];

        this.init();
        this.draw();
    }

    init() {
        this.pieces.push(
            ChessPieceFactory.createPiece(
                "rook",
                "black",
                0,
                0,
                this.boardSettings
            )
        );
        this.pieces.push(
            ChessPieceFactory.createPiece(
                "knight",
                "black",
                0,
                1,
                this.boardSettings
            )
        );
        this.pieces.push(
            ChessPieceFactory.createPiece(
                "bishop",
                "black",
                0,
                2,
                this.boardSettings
            )
        );
        this.pieces.push(
            ChessPieceFactory.createPiece(
                "queen",
                "black",
                0,
                3,
                this.boardSettings
            )
        );
        this.pieces.push(
            ChessPieceFactory.createPiece(
                "king",
                "black",
                0,
                4,
                this.boardSettings
            )
        );
        this.pieces.push(
            ChessPieceFactory.createPiece(
                "bishop",
                "black",
                0,
                5,
                this.boardSettings
            )
        );
        this.pieces.push(
            ChessPieceFactory.createPiece(
                "king",
                "white",
                7,
                4,
                this.boardSettings
            )
        );
        this.pieces.push(
            ChessPieceFactory.createPiece(
                "bishop",
                "white",
                5,
                4,
                this.boardSettings
            )
        );
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

    drawChessboard(numberOfSquares, squareSize, frameSize, boardIndex) {
        // Draw frame
        let textOfset = 33;

        let collomnPos = frameSize + squareSize / 2;
        let textColor = "black";
        for (var i = 0; i < numberOfSquares; i++) {
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
                frameSize + this.bordHeight + textOfset
            );
            context.fillText(
                8 - i,
                frameSize - textOfset,
                collomnPos + i * squareSize
            );
            context.fillText(
                boardIndex.vertical[7 - i],
                frameSize + this.bordHeight + textOfset,
                collomnPos + i * squareSize
            );
        }
        // Draw board
        for (var row = 0; row < numberOfSquares; row++) {
            for (var col = 0; col < numberOfSquares; col++) {
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
            console.log("drawing piece ", this.pieces[piece]);
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
            // console.log("out of range");
            return null;
        }
        if (col > 8 || row > 8) {
            // console.log("out of range");
            return null;
        }
        // console.log(
        //     row - 1,
        //     col - 1,
        //     this.boardIndex.horizontal[col - 1] +
        //         this.boardIndex.vertical[8 - row]
        // );
        return (
            this.boardIndex.horizontal[col - 1] + "  " +
            this.boardIndex.vertical[8 - row]
        );
    }

    getSquareNameFromAbsPos(absPosY, absPosX) {
        let col = this.scaleAbsPosToBordPos(absPosX);
        let row = this.scaleAbsPosToBordPos(absPosY);
        return this.getSquareName(row, col);
    }

    scaleAbsPosToBordPos(Pos) {
        let x_max = this.frameSize + this.boardSize * this.squareSize;
        let x_min = this.frameSize;
        let y_max = 9;
        let y_min = 1;
        let y = ((y_max - y_min) / (x_max - x_min)) * (Pos - x_min) + y_min;
        // return y;
        return Math.floor(y);
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

    notifyObservers(data) {
        for (const observer of this.observers) {
            const test = { offsetX: 53, offsetY: 99 };
            observer.update(data);
        }
    }

    mouseTracker(event) {
        this._mouseX = event.clientX;
        this._mouseY = event.clientY;
        // this._debugData = this.getDebugData();
        // console.log(this.getDebugData());
        // this.drawOnDisplay(this._debugData);
        this.notifyObservers(event);
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
    update(data) {
        // console.log("debuger notifide!!");
        const debugData = this.getDebugData(data);
        this.drawOnDisplay(debugData);
    }
    
    drawOnDisplay(debugData) {
        let fontSize = 20;
        let debugHeight = debugData.length * fontSize;
        let debugWidth = 200;

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

    getDebugData(data) {
        let boxPosition = canvas.getBoundingClientRect();
        let mousePositionX = data.offsetX;
        let mousePositionY = data.offsetY;
        let squareSize = this._chessboard.squareSize;
        let absSquareName = this._chessboard.getSquareNameFromAbsPos(
            mousePositionY,
            mousePositionX
        );
        let observers = this._chessboard.observers;

        return [
            `canvas.width ${canvas.width}`,
            `canvas.height ${canvas.height}`,
            `squareSize ${squareSize}`,
            `boxPosition.left: ${boxPosition.left}`,
            `boxPosition.top: ${boxPosition.top}`,
            `boxPosition.right: ${boxPosition.right}`,
            `boxPosition.bottom: ${boxPosition.bottom}`,
            `clientX: ${this._chessboard._mouseX}`,
            `clientY: ${this._chessboard._mouseY}`,
            `data.offseX: ${data.offsetX}`,
            `data.offseY: ${data.offsetY}`,
            `SquareName: ${absSquareName}`,
            `observers: ${observers.length}`,
        ];
    }
}

class UserInteractionHandler {
    constructor(chessboard) {
        this._chessboard = chessboard;
        canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
    }

    handleMouseMove(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.offsetX;
        const y = event.offsetY;

        // this._chessboard.draw();
        context.fillStyle = "red";
        context.fillRect(x, y - 30, 50, 200);
        context.fillStyle = "yellow";
        context.fillText(x, x, y - 10);
        context.fillText(y, x, y + 10);
    }
}


const chessboard = new Chessboard();

const appDebugger = new Debugger(chessboard);

// const userInteractionHandler = new UserInteractionHandler(chessboard);
