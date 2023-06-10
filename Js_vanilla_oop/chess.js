let canvas = document.getElementById("chessboard");
let context = canvas.getContext("2d");

class Chessboard {
    constructor() {
        console.log("constructed obj Chessboard");
        this.frameSize = 90;
        this.boardSize = 8;
        this.squareColor = ["#7a8285", "#222"];
        this.boardIndex = {
            horizontal: ["a", "b", "c", "d", "e", "f", "h", "g"],
            vertical: ["1", "2", "3", "4", "5", "6", "7", "8"],
        };
        this.bordWidth = canvas.width - this.frameSize * 2;
        this.bordHeight = this.bordWidth;
        this.squareSize = this.bordWidth / this.boardSize;

        this.observers = [];
        this.draw();
    }

    draw() {
        console.log("draw Chessboard");

        this.drawChessboard(
            this.boardSize,
            this.squareSize,
            this.frameSize,
            this.boardIndex
        );
    }

    drawChessboard(boardSize, squareSize, frameSize, boardIndex) {
        // Draw frame
        let textOfset = 33;

        let collomnPos = frameSize + squareSize / 2;

        for (var i = 0; i < boardSize; i++) {
            context.font = "bold 30px serif";
            context.textAlign = "center";
            context.textBaseline = "middle";
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

        this.notifyObservers();
    }

    getSquareName(row, col) {
        // this.notifyObservers();

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
            this.boardIndex.horizontal[col - 1] + this.boardIndex.vertical[8-row]
        );
        return this.boardIndex.horizontal[col - 1] + this.boardIndex.vertical[8 - row];
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
}

class Debugger {
    constructor(chessboard) {
        this._chessboard = chessboard;
        this.showDebugger = true;
        if (this.showDebugger) {
            this._chessboard.addObserver(this); // adding debugger as observer to chessboard.
            canvas.addEventListener("mousemove", this.mouseTracker.bind(this));
            // this.drawOnDisplay();
        }
    }

    // Update when notifyid from subject (the observed object)
    update() {
        console.log("debuger notifide!!")
        // this._debugData = this.getDebugData();
        // this.drawOnDisplay(this._debugdata);
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
        let boxX = this._mouseX - boxPosition.left;
        let boxY = this._mouseY - boxPosition.top;
        let squareSize = this._chessboard.squareSize;
        let row = Math.floor(boxY / squareSize);
        let col = Math.floor(boxX / squareSize);
        let squareName = this._chessboard.getSquareName(row, col);

        return [
            `canvas.width ${canvas.width}`,
            `canvas.height ${canvas.height}`,
            `boxPosition.left: ${boxPosition.left}`,
            `boxPosition.top: ${boxPosition.top}`,
            `boxX: ${boxX}`,
            `boxY: ${boxY}`,
            `Square: ${squareName}`,
        ];
    }
    mouseTracker(event) {
        this._mouseX = event.clientX;
        this._mouseY = event.clientY;
        this._debugData = this.getDebugData();
        // console.log(this.getDebugData());
        this.drawOnDisplay(this._debugData);
    }
}

const chessboardw = new Chessboard();

const appDebugger = new Debugger(chessboardw);
