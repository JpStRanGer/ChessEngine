let canvas = document.getElementById("chessboard");
let context = canvas.getContext("2d");

class Chessboard {
    constructor() {
        console.log("constructed obj Chessboard");
        this.boardSize = 8;
        this.squareSize = canvas.width / 8;

        this.draw();
    }

    draw() {
        console.log("draw Chessboard");

        for (var row = 0; row < this.squareSize; row++) {
            for (var col = 0; col < this.boardSize; col++) {
                context.fillStyle = (row + col) % 2 === 0 ? "red" : "blue";
                context.fillRect(
                    row * this.squareSize,
                    col * this.squareSize,
                    this.squareSize,
                    this.squareSize
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
            this.drawOnDisplay();
        }
    }

    drawOnDisplay() {
        let debugHeight = 100;
        let debugWidth = 300;
        context.fillStyle = "gray";
        context.fillRect(
            0,
            canvas.height - debugHeight,
            debugWidth,
            debugHeight
        );

        context.fillStyle = "black";
        context.font = "bold 30px serif";
        context.textBaseline = "top";
        let lines = 3;
        let lineHeight = debugHeight/lines;
        let debugData = [
            `Font ${context.font}`,
            `canvas.width ${canvas.width}`,
            `canvas.height ${canvas.height}`,
        ]
        for (var line = 0; line < lines; line++) {
            context.fillText(
                debugData[line],
                10,
                canvas.height - debugHeight + 5 + lineHeight*line,
                debugWidth
            );
        }
    }
}

const chessboard = new Chessboard();

const appDebugger = new Debugger();
