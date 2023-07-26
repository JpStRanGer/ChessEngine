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
    static createPiece(type, color, row, col, chessboard) {
        switch (type) {
            case "rook":
                return new Rook(color, row, col, chessboard);
            case "knight":
                return new Knight(color, row, col, chessboard);
            case "bishop":
                return new Bishop(color, row, col, chessboard);
            case "queen":
                return new Queen(color, row, col, chessboard);
            case "king":
                return new King(color, row, col, chessboard);
            case "pawn":
                return new Pawn(color, row, col, chessboard);
        }
        // Add more piece types as needed
    }
}


class PiecePosition {


    _currentPos = {
        absPos: undefined,
        relPos: undefined,
        absRow: undefined,
        absCol: undefined,
        relRow: undefined,
        relCol: undefined,
        posNameString: undefined,
    };
    oldPositions = [];

    proxyHandler = {
        get: (target, property, receiver) => {
            return target[property]; // Just retrun the propertie value without anything else
        },
        set: (target, property, value, receiver) => {
            // console.log("setting:", this._piece._type, ` property: ${property} to ${value}, ${this._piece._chessboard.getSquareNamefromRelPos(...value)}`, this._piece)

            // Store a copy of the current position before making changes
            // const oldPosCopy = {...target._currentPos };
            // this.oldPositions.push(oldPosCopy);

            switch (property) {
                case "absPos":
                    console.warn("this method/case is not tested!!")
                    console.log(target)
                    target[property] = value;
                    target["relPos"] = this._piece._chessboard.scaleAbsPosToBordPos(value);
                    [target["absRow"], target["absCol"]] = value;
                    [target["relRow"], target["relCol"]] = target["relPos"];
                    // [target["relRow"], target["relCol"]] = [5, 5];
                    target["posNameString"] = this._piece._chessboard.getSquareNameFromAbsPos(...value);
                    console.log(target)
                    break;
                case "relPos":
                    console.warn(`setting relPos`)
                    target["absPos"] = this._piece._chessboard.getAbsPosByRelPos(value);
                    target[property] = value;
                    [target["absRow"], target["absCol"]] = this._piece._chessboard.getAbsPosByRelPos(value);
                    [target["relRow"], target["relCol"]] = value;
                    target["posNameString"] = this._piece._chessboard.getSquareNamefromRelPos(...value);
                    break;

                default:
                    console.warn(`no maching case for ${property}`)
            }
            return true;
        }
    };

    currentPos = new Proxy(this._currentPos, this.proxyHandler);

    constructor(relRow, relCol, piece) {
        this._piece = piece;
        this.currentPos.relPos = [relRow, relCol];
    }

}

class ChessPiece {
    _type = undefined;
    _chessboard = undefined;
    _piecePosition = undefined;

    constructor(color, row, col, chessboard) {
        this._chessboard = chessboard;
        this.piecePosition = new PiecePosition(row, col, this); // TODO: change funtionality for using Possition class
        this._color = color;
        this._selected = false;
        this.setPieceStyle();
    }

    // Getter for selecting and release piece
    get select() {
        this._selected = true;
        return this;
    }

    get release() {
        this._selected = false;
        return null;
    }

    // Getter for checking if piece is selected
    get selected() {
        return this._selected;
    }

    // Setter for selecting if piece is selected
    set selected(value) {
        this._selected = value;
    }

    // Getter for checking if piece is selected
    get type() {
        return this._type;
    }

    setPieceStyle() {
        let blackPieceColor = "yellow";
        let whitePieceColor = "red";
        let blackBackgroundColor = "yellow";
        let whiteBackgroundColor = "red";
        this._pieceColor =
            this._color === "white" ? blackPieceColor : whitePieceColor;
    }

    draw() {
        context.fillStyle = this._pieceColor;
        context.font = "bold 20px serif";
        context.fillText(
            this._type,
            this.piecePosition.currentPos.absCol,
            this.piecePosition.currentPos.absRow
        );
    }
}

class Rook extends ChessPiece {
    constructor(color, row, col, boardSettings) {
        super(color, row, col, boardSettings);
        this._type = "Rook";
        this.piecePosition = new PiecePosition(row, col, this); // TODO: change funtionality for using Possition class
    }
}

class Knight extends ChessPiece {
    constructor(color, row, col, boardSettings) {
        super(color, row, col, boardSettings);
        this._type = "Knight";
        this.piecePosition = new PiecePosition(row, col, this); // TODO: change funtionality for using Possition class
    }
}

class Bishop extends ChessPiece {
    constructor(color, row, col, boardSettings) {
        super(color, row, col, boardSettings);
        this._type = "Bishop";
        this.piecePosition = new PiecePosition(row, col, this); // TODO: change funtionality for using Possition class
    }
}

class Queen extends ChessPiece {
    constructor(color, row, col, boardSettings) {
        super(color, row, col, boardSettings);
        this._type = "Queen";
        this.piecePosition = new PiecePosition(row, col, this); // TODO: change funtionality for using Possition class
    }
}

class King extends ChessPiece {
    constructor(color, row, col, boardSettings) {
        super(color, row, col, boardSettings);
        this._type = "King";
        this.piecePosition = new PiecePosition(row, col, this); // TODO: change funtionality for using Possition class
    }
}
class Pawn extends ChessPiece {
    constructor(color, row, col, boardSettings) {
        super(color, row, col, boardSettings);
        this._type = "Pawn";
        this.piecePosition = new PiecePosition(row, col, this); // TODO: change funtionality for using Possition class
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
    boardIndex = {
        horizontal: ["A", "B", "C", "D", "E", "F", "H", "G"],
        vertical: ["1", "2", "3", "4", "5", "6", "7", "8"],
    };
    constructor() {
        this.frameSize = 90;
        this.numberOfSquares = 8;
        this.bordWidth = canvas.width - this.frameSize * 2;
        this.bordHeight = this.bordWidth;
        this.squareSize = this.bordWidth / this.numberOfSquares;
        this.squareColor = ["#7a8285", "#222"];
        this.backgroundColor = "lightgray";
    }
}

class Chessboard {
    // _test = undefined;
    constructor() {
        canvas.addEventListener("mousemove", this.mouseTracker.bind(this));

        this.boardSettings = new BoardSettings();
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
            ChessPieceFactory.createPiece("rook", "black", 0, 0, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("knight", "black", 0, 1, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("bishop", "black", 0, 2, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("queen", "black", 0, 3, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("king", "black", 0, 4, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("bishop", "black", 0, 5, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("knight", "black", 0, 6, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("rook", "black", 0, 7, this)
        );
        for (let i = 0; i < 8; i++) {
            this.pieces.push(
                ChessPieceFactory.createPiece("pawn", "black", 1, i, this)
            )
        }
        this.pieces.push(
            ChessPieceFactory.createPiece("rook", "white", 7, 0, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("knight", "white", 7, 1, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("bishop", "white", 7, 2, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("queen", "white", 7, 3, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("king", "white", 7, 4, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("bishop", "white", 7, 5, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("knight", "white", 7, 6, this)
        );
        this.pieces.push(
            ChessPieceFactory.createPiece("rook", "white", 7, 7, this)
        );
        for (let i = 0; i < 8; i++) {
            this.pieces.push(
                ChessPieceFactory.createPiece("pawn", "white", 6, i, this)
            )
        }
    }

    draw() {
        this.drawChessboard(
            this.boardSize,
            this.squareSize,
            this.frameSize,
            this.boardIndex
        );
        this.drawPieces();
        // this.notifyObservers();
    }

    drawChessboard(numberOfSquares, squareSize, frameSize) {
        // Draw background
        context.fillStyle = this.boardSettings.backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

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
                this.boardSettings.boardIndex.horizontal[i],
                collomnPos + i * squareSize,
                frameSize - textOfset
            );
            context.fillText(
                this.boardSettings.boardIndex.horizontal[i],
                collomnPos + i * squareSize,
                frameSize + this.bordHeight + textOfset
            );
            context.fillText(
                8 - i,
                frameSize - textOfset,
                collomnPos + i * squareSize
            );
            context.fillText(
                this.boardSettings.boardIndex.vertical[7 - i],
                frameSize + this.bordHeight + textOfset,
                collomnPos + i * squareSize
            );
        }
        // Draw board
        for (var row = 0; row < numberOfSquares; row++) {
            for (var col = 0; col < numberOfSquares; col++) {
                context.fillStyle =
                    (row + col) % 2 === 0 ?
                    this.boardSettings.squareColor[0] :
                    this.boardSettings.squareColor[1];
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
        for (const index in this.pieces) {
            this.pieces[index].draw();
        }
        // The function above uses `in` to make indexes for each piece instead of 
        // th function below that uses `of` to return the acctual piece.
        // or
        //
        // for (const piece of this.pieces) {
        //     piece.draw();
        // }
    }

    getPieceByAbsPos(absRow, absCol) {
        this.test = null;
    }

    getPieceByRelPos(relRow, relCol) {
        for (const piece of this.pieces) {
            if (
                piece.piecePosition.currentPos.relRow === relRow &&
                piece.piecePosition.currentPos.relCol === relCol
            ) {
                return piece.select;
            }
        }
        return null;
    }

    getSquareNamefromRelPos(row, col) {
        if (col < 0 || row < 0) {
            return null;
        }
        if (col > 7 || row > 7) {
            return null;
        }
        return (
            this.boardSettings.boardIndex.horizontal[col] +
            // "  " +
            this.boardSettings.boardIndex.vertical[7 - row]
        );
    }

    getSquareNameFromAbsPos(absPosY, absPosX) {
        let [row, col] = this.scaleAbsPosToBordPos([absPosY, absPosX]);
        return this.getSquareNamefromRelPos(row, col);
    }

    getSquareRelPosFromAbsPos(absPosY, absPosX) {
        return this.scaleAbsPosToBordPos([absPosY, absPosX]);
    }

    getAbsPosByRelPos(pos) {
        return pos.map(x => this.frameSize + x * this.squareSize + this.squareSize / 2)
    }

    scaleAbsPosToBordPos(Pos) {
        let x_max = this.frameSize + this.boardSize * this.squareSize;
        let x_min = this.frameSize;
        let y_max = 8;
        let y_min = 0;

        return Pos.map((x) => Math.floor(((y_max - y_min) / (x_max - x_min)) * (x - x_min) + y_min));
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
            observer.update(data);
        }
    }

    mouseTracker(event) {
        this._mouseX = event.clientX;
        this._mouseY = event.clientY;
        this.draw();
        this.notifyObservers(event);
    }
}

class Debugger {
    externalDebugDisplay = document.getElementById("debugger-div"); // Get the reference to the <div> element
    showDebugger = true;

    constructor(chessboard) {
        this._chessboard = chessboard;
        if (this.showDebugger) {
            this._chessboard.addObserver(this); // adding debugger as observer to chessboard.
            // this.drawOnDisplay();
        }
    }

    // Update when notifyid from subject (the observed object)
    update(data) {
        const debugData = this.getDebugData(data);
        // this.drawOnDisplay(debugData);
        this.printOnDIV(debugData);
        // this.drawOnMouse(data);
        // this.formatDebugText(debugData);
    }

    drawOnMouse(data) {
        this.x = data.offsetX;
        this.y = data.offsetY;
        context.fillStyle = "red";
        context.fillRect(this.x + 20, this.y - 10, 60, 50);
        context.fillStyle = "yellow";
        context.fillText(`x-${this.x}`, this.x + 25, this.y - 10);
        context.fillText(`y-${this.y}`, this.x + 25, this.y + 10);
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
            // `canvas.width: ${canvas.width}`,
            // `canvas.height: ${canvas.height}`,
            // `squareSize: ${squareSize}`,
            // `boxPosition.left: ${boxPosition.left}`,
            // `boxPosition.top: ${boxPosition.top}`,
            // `boxPosition.right: ${boxPosition.right}`,
            // `boxPosition.bottom: ${boxPosition.bottom}`,
            `_mouseX: ${this._chessboard._mouseX}`,
            `_mouseY: ${this._chessboard._mouseY}`,
            `data.offseX: ${data.offsetX}`,
            `data.offseY: ${data.offsetY}`,
            `SquareName: ${absSquareName}`,
            `observers: ${observers.length}`,
        ];
    }

    printOnDIV(debugData) {
        // this.externalDebugDisplay.textContent = this.formatDebugText(debugData); // This method works, but without interpreting HTML tags or entities. It just prints the string as it is!
        this.externalDebugDisplay.innerHTML = this.formatDebugText(debugData); // this
    }

    formatDebugText(strings) {
        // Create a new <p> element for each string
        return strings
            .map((str) => {
                const startIndex = str.lastIndexOf(":") + 2;
                const endIndex = str.length;
                // const substring = str.substring(startIndex - 10, str.length);
                const substring1 = str.slice(0, startIndex);
                // const substring2 = str.slice(startIndex, str.length);
                // const substring2 = str.substring(startIndex, str.length);
                const substring2 = str.substr(startIndex, str.length);

                const firstPart = substring1;
                const lastPart = substring2;

                return `<span class="debug--text">${firstPart}</span> <span class="debug--value">${lastPart}</span> <br/>`;
            })
            .join("\n");

        // Set the formatted text as the content of the <div>
        // this.externalDebugDisplay.innerHTML = paragraphs;
    }
}

class UserInteractionHandler {
    constructor(chessboard) {
        this._chessboard = chessboard;
        this._selectedPiece = null;

        canvas.addEventListener("mousemove", this.handleMouseMove.bind(this));
        canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    }

    handleMouseMove(event) {
        this.x = event.offsetX;
        this.y = event.offsetY;
        if (this._selectedPiece === null) {
            console.log("this._selectedPiece === null")
        } else {
            this._selectedPiece.piecePosition.currentPos.absPos = [this.y, this.x];


        }
    }

    handleMouseDown(event) {
        console.log("Mouse down!");
        let [row, col] = this._chessboard.getSquareRelPosFromAbsPos(
            this.y,
            this.x
        );

        this._selectedPiece = this._chessboard.getPieceByRelPos(row, col);
    }

    handleMouseUp(event) {
        console.log("Mouse up!");
        this._selectedPiece.piecePosition.currentPos.relPos = this._chessboard.scaleAbsPosToBordPos([this.y, this.x]);
        this._selectedPiece = this._selectedPiece.release;
    }
}

const chessboard = new Chessboard();

const appDebugger = new Debugger(chessboard);

const userInteractionHandler = new UserInteractionHandler(chessboard);