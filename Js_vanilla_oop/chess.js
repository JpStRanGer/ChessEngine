let canvas = document.getElementById("chessboard");
let context = canvas.getContext("2d");

class Chessboard {
    constructor() {
        console.log("constructed obj Chessboard");
        this.frameSize = 50;
        this.boardSize = 8;
        this.squareColor = ["#7a8285","#222"]
        this.bordWidth = canvas.width - this.frameSize * 2;
        this.bordHeight = this.bordWidth;
        this.squareSize = this.bordWidth / this.boardSize;

        this.draw();
    }

    draw() {
        console.log("draw Chessboard");

        this.drawChessboard(this.boardSize, this.squareSize, this.frameSize);
    }

    drawChessboard(boardSize, squareSize, frameSize) {
        // Draw frame
        let textOfset = 13;
        let boardIndex = {
            horizontal: ["a", "b", "c", "d", "e", "f", "h", "g"],
            vertical: ["1", "2", "3", "4", "5", "6", "7", "8"],
        };
        for (var i = 0; i < boardSize; i++) {
            context.font = "bold 30px serif";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(
                boardIndex.horizontal[i],
                frameSize + squareSize / 2 + i * squareSize,
                frameSize - textOfset
            );
            context.fillText(
                boardIndex.horizontal[i],
                frameSize + squareSize / 2 + i * squareSize,
                frameSize + this.bordHeight + textOfset
            );
            context.fillText(
                8 - i,
                frameSize - 10,
                frameSize + squareSize / 2 + i * squareSize
            );
            context.fillText(
                boardIndex.vertical[7 - i],
                frameSize + this.bordHeight + 25,
                frameSize + squareSize / 2 + i * squareSize
            );
        }
        // Draw board
        for (var row = 0; row < boardSize; row++) {
            for (var col = 0; col < boardSize; col++) {
                context.fillStyle = (row + col) % 2 === 0 ? this.squareColor[0] : this.squareColor[1];
                context.fillRect(
                    frameSize + row * squareSize,
                    frameSize + col * squareSize,
                    squareSize,
                    squareSize
                );
            }
        }
    }

    showDebugger() {}
}

class Debugger {
    constructor(chessboard) {
        this.showDebugger = true;
        if (this.showDebugger) {
            canvas.addEventListener("mousemove", this.mouseTracker.bind(this));
            // this.drawOnDisplay();
        }
    }

    drawOnDisplay(debugData) {
        let debugHeight = 300;
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
        context.font = "bold 30px serif";
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

    mouseTracker(event) {
        let boxPosition = canvas.getBoundingClientRect();
        let debugData = [
            // `Font ${context.font}`,
            `canvas.width ${canvas.width}`,
            `canvas.height ${canvas.height}`,
            `boxPosition.left: ${boxPosition.left}`,
            `boxPosition.top: ${boxPosition.top}`,
            `event.clientX: ${event.clientX}`,
            `event.clientY: ${event.clientY}`,
            `boxX: ${event.clientX - boxPosition.left}`,
            `boxY: ${event.clientY - boxPosition.top}`,
        ];
        this.drawOnDisplay(debugData);
    }
}

const chessboard = new Chessboard();

const appDebugger = new Debugger();
