import { Pawn, Rook, Knight, Bishop, King, Queen } from "./Chesspiece.js"
import { icons } from "../main.js"

export default class Chessboard {

    constructor(SQUARE_COUNT = 8, CANVAS_SIZE = 640) {
        // Set canvas size and validate square count
        this.CANVAS_SIZE = CANVAS_SIZE;
        this.squareCount = this.setSquareSide(SQUARE_COUNT);

        // Calculate the size of an individual square in pixels
        this.squareSize = this.CANVAS_SIZE / this.squareCount;

        // List of "back row" pieces, may change later due to duplicate in main.js
        this.pieceList = ["Rook", "Knight", "Bishop", "Queen", "King", "Bishop", "Knight", "Rook"]

        // Number of square to offset the pieces by if the board length
        // is greater than the number of pieces 
        this.offset = (this.squareCount - this.pieceList.length) / 2;

        // Initialise the board array in the format
        // this.boardArray[row][column]
        this.boardArray = this.INIT_BOARD_ARRAY();
        console.log(`Initial Board:`, this.boardArray);

        // Initialise variables to be used for square clicking
        this.currentSquare = { X: 0, Y: 0 };
        this.pieceSquare;

        // Flag variable for when piece moves are being previewed
        this.preview = false;

        // Set initial turn colour
        this.turnColour = "White";

        // Set turn count
        this.turnCount = 1;

        // Set game over flag
        this.gameOver = false;

        // Generate the grid and display pieces on startup
        this.GENERATE_GRID();
        this.DISPLAY_ALL_PIECES();
    }

    // Constructor extension functions
    setSquareSide(sidelength) {
        if (sidelength % 2 !== 0) {
            sidelength += 1;
        }
        else if (sidelength < 8) {
            sidelength = 8;
        }

        return sidelength;
    }

    // Board intialisation (GRAPHICAL)
    GENERATE_GRID() {
        // Coloured square value
        let colour = 230;
        
        // Clear & add base colour:
        clear();
        // fill(230);

        // Outline board
        noFill();
        rect(0, 0, this.CANVAS_SIZE);

        // Draw gridlines on board
        for (let i = 1; i < this.squareCount; i++) {
            line(0, i * this.squareSize, this.CANVAS_SIZE, i * this.squareSize);
            line(i * this.squareSize, 0, i * this.squareSize, this.CANVAS_SIZE);
        }

        // Colour every other square
        for (let x = -1; x < this.squareCount; x += 2) {    // For every row...          
            for (let y = 0; y < this.squareCount; y += 2) {    // For every column...
                
                // Set coloured square colour
                fill(colour);

                rect((x + 1) * this.squareSize, y * this.squareSize, this.squareSize);
                rect(x * this.squareSize, (y + 1) * this.squareSize, this.squareSize);
            }
        }
    }

    // Board intialisation (ARRAY)
    INIT_BOARD_ARRAY() {
        // Create blank 2D board to act as the board
        var blank = "";
        // I forgor how this works - recommended course of action:
        // look this up dumbass
        var boardArray = [...Array(this.squareCount)].map(e => Array(this.squareCount).fill(blank));

        // Populate array with pieces
        // Place pieces by column
        for (let column = this.offset; column < this.pieceList.length + this.offset; column++) {
            // Black pieces
            boardArray[0][column] = eval(`new ${this.pieceList[column - this.offset]}("Black")`);
            boardArray[1][column] = new Pawn("Black");

            // White pieces
            boardArray[this.squareCount - 2][column] = new Pawn("White");
            boardArray[this.squareCount - 1][column] = eval(`new ${this.pieceList[column - this.offset]}("White")`);
        }

        // Test Pieces
        // boardArray[1][3] = "";
        // boardArray[4][1] = new Knight("Black");
        // boardArray[3][3] = new King("Black");
        // boardArray[4][5] = new Queen("Black");

        return boardArray;
    }

    // Dispaly all chess pieces...
    DISPLAY_ALL_PIECES() {
        // For each row in the array, and then for each square in that row...
        for (let row = 0; row < this.boardArray.length; row++) {
            for (let square = 0; square < this.pieceList.length + this.offset; square++) {
                // If the array reference isn't empty...
                if (this.boardArray[row][square] != "") {
                    // Get the piece name in the square...
                    let pieceName = this.boardArray[row][square].name;

                    // Find in the icon array, the image object with a name attribute matching the name above.
                    // The display it according to the X, Y, Size parameters.
                    image(icons[icons.indexOf(icons.find(object => object.name == pieceName))].val, // Image
                        square * this.squareSize, row * this.squareSize, // X, Y
                        this.squareSize, this.squareSize); // Size
                }
            }
        }
    }

    // Get the square that was clicked by the user
    GET_SELECTED_SQUARE() {
        if (this.gameOver == true) {
            return null;
        }


        let X = Math.floor(mouseX / this.squareSize);
        let Y = Math.floor(mouseY / this.squareSize);

        // Update current square
        this.currentSquare = { X: X, Y: Y };

        // Check to see if a piece was clicked, ensure that it is a turn piece
        if (this.boardArray[Y][X] != "" && this.boardArray[Y][X].colour == this.turnColour) {
            // Set the current square as the square the selected piece is in
            this.pieceSquare = this.currentSquare;

            // Reset available moves
            this.boardArray[this.pieceSquare.Y][this.pieceSquare.X].availableMoves = [];

            // Get and show the available moves
            this.boardArray[Y][X].getAvailableMoves(this.pieceSquare, this.boardArray);
            this.previewMoves();
        }
        // Check to see if the game is in a preview state, check if the move is valid
        else if (this.preview == true) {
            this.boardArray[this.pieceSquare.Y][this.pieceSquare.X].availableMoves.forEach(move => {
                if (JSON.stringify(move) === JSON.stringify(this.currentSquare)) {
                    this.movePiece();
                }
            });
        }
        // If the game is not in a preview state and a turn piece wasn't clicked, do nothing
        else {
            null
        }
    }

    // Display the possible moves of a piece
    previewMoves() {
        // The display method works by clearing the canvas completely
        // and re-drawing the board with the new array data

        // Re-draw grid & display pieces:
        this.GENERATE_GRID();
        this.DISPLAY_ALL_PIECES();

        // A square with a piece in has been clicked and the available moves for it have been fetched,
        // for each of these moves, 'move', draw a coloured ellipse mark. If the square is an enemy
        // square, mark it red, otherwise mark it green.
        this.boardArray[this.currentSquare.Y][this.currentSquare.X].availableMoves.forEach(move => {
            // console.log(this.boardArray[this.currentSquare.Y][this.currentSquare.X].colour);
            if (this.boardArray[move.Y][move.X].colour != this.turnColour && this.boardArray[move.Y][move.X] != "") {
                fill(89, 52, 52); // Red
                ellipse((move.X * this.squareSize) + (this.squareSize / 2), (move.Y * this.squareSize) + (this.squareSize / 2), 20);
            } else {
                fill(52, 89, 52); // Green
                ellipse((move.X * this.squareSize) + (this.squareSize / 2), (move.Y * this.squareSize) + (this.squareSize / 2), 20);
            }
        });

        // Change the flag variable to indicate that the game is in a preview state
        this.preview = true;
    }

    movePiece() {
        // Check if king was taken
        if (this.boardArray[this.currentSquare.Y][this.currentSquare.X] != '' && this.boardArray[this.currentSquare.Y][this.currentSquare.X].type == 'King') {
            this.gameOver = true;
            console.log("Game Over");
        }
        
        // Take a record of the piece being moved
        let movingPiece = this.boardArray[this.pieceSquare.Y][this.pieceSquare.X]; 
        // Set the square the piece is moving to to the value of the recorded piece
        this.boardArray[this.currentSquare.Y][this.currentSquare.X] = movingPiece;
        // Clear the square the piece moved from
        this.boardArray[this.pieceSquare.Y][this.pieceSquare.X] = ''

        /* Move animation in here maybe? */

        // Set first move flag if pawn moved
        if(movingPiece.type == "Pawn") {
            movingPiece.firstMove = false;
        }

        // Set preview off
        this.preview = false;

        // Re-draw grid & display pieces
        this.GENERATE_GRID();
        this.DISPLAY_ALL_PIECES();

        // If the game is over display end game message
        if (this.gameOver == true) {
            fill(230);
            rect((this.CANVAS_SIZE / 2) - (7 * this.squareSize / 2), (this.CANVAS_SIZE / 2) - 90, 7 * this.squareSize, 180)

            fill(0); textSize(100); textAlign(CENTER);
            text("GAME OVER", this.CANVAS_SIZE / 2, this.CANVAS_SIZE / 2);

            textSize(50);
            text(`${this.turnColour} won in ${this.turnCount} turns!`, this.CANVAS_SIZE / 2, (this.CANVAS_SIZE / 2) + 75);

            // Exit method
            return null;
        }

        // Switch turn colour ('Conditional Operator')
        this.turnColour = (this.turnColour == "White" ? "Black" : "White");

        // Log & update turn data
        console.log(`Turn: ${this.turnCount}`, this.boardArray);
        this.turnCount += 1;
    }
}