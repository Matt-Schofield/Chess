// Import parent Chesspiece class from which all specific chess piece types are derived
import Chesspiece from "./Chesspiece.super.js";

// Each piece has similar functionality 

class Pawn extends Chesspiece {
    constructor(colour) {
        super(colour, "Pawn")
        // Flag to indicate if the pawn has moved
        this.firstMove = true;
    }

    getAvailableMoves(currentPosition, boardArray) { 
        // If the colour is white, we want the pawns to move down, if black
        // they should move up 
        let direction = (this.colour == "White" ? -1 : 1);
        // Based on whether the pawn has moved or not, move 1 or 2 squares
        let amount = (this.firstMove == true ? 2 : 1);

        // Check the immediate diagonal squares for enemies
        if(boardArray[currentPosition.Y + direction][currentPosition.X - 1] != "") { super.checkSquare({X: currentPosition.X - 1, Y: currentPosition.Y + direction}, boardArray) }
        if(boardArray[currentPosition.Y + direction][currentPosition.X + 1] != "") { super.checkSquare({X: currentPosition.X + 1, Y: currentPosition.Y + direction}, boardArray) }

        // If there isn't any enemy in front of the piece, explore that direction.
        // This check isn't needed for other pieces, unlike pawns they don't have the restriction
        // on which directions they can take pieces in.
        if(boardArray[currentPosition.Y + direction][currentPosition.X] == "") {
            super.exploreY(direction, amount, currentPosition, boardArray);
        }
    }
}

class Rook extends Chesspiece {
    constructor(colour) {
        super(colour, "Rook")
    }

    getAvailableMoves(currentPosition, boardArray) {
        super.exploreY( 1, boardArray.length, currentPosition, boardArray);
        super.exploreY( -1, boardArray.length, currentPosition, boardArray);

        super.exploreX( 1, boardArray.length, currentPosition, boardArray);
        super.exploreX( -1, boardArray.length, currentPosition, boardArray);
    }
}

class Knight extends Chesspiece {
    constructor(colour) {
        super(colour, "Knight")
        // RIGHT, LEFT,
        // UP, DOWN
        this.KNIGHT_MOVES = [
            {X: 2, Y: 1}, {X: 2, Y: -1}, {X: -2, Y: 1}, {X: -2, Y: -1},
            {X: 1, Y: 2}, {X: -1, Y: 2}, {X: 1, Y: -2}, {X: -1, Y: -2}
        ];
    }

    getAvailableMoves(currentPosition, boardArray) {
        this.KNIGHT_MOVES.forEach(move => {
            super.checkSquare({X: currentPosition.X + move.X, Y: currentPosition.Y + move.Y}, boardArray)
        });
    }
}

class Bishop extends Chesspiece {
    constructor(colour) {
        super(colour, "Bishop")
    }

    getAvailableMoves(currentPosition, boardArray) {
        super.exploreDiag(1, 1, boardArray.length, currentPosition, boardArray);
        super.exploreDiag(1, -1, boardArray.length, currentPosition, boardArray);
        super.exploreDiag(-1, 1, boardArray.length, currentPosition, boardArray);
        super.exploreDiag(-1, -1, boardArray.length, currentPosition, boardArray);
    }
}

class King extends Chesspiece {
    constructor(colour) {
        super(colour, "King")
    }

    getAvailableMoves(currentPosition, boardArray) {
        super.exploreY( 1, 1, currentPosition, boardArray);
        super.exploreY( -1, 1, currentPosition, boardArray);

        super.exploreX( 1, 1, currentPosition, boardArray);
        super.exploreX( -1, 1, currentPosition, boardArray);

        super.exploreDiag(1, 1, 1, currentPosition, boardArray);
        super.exploreDiag(1, -1, 1, currentPosition, boardArray);
        super.exploreDiag(-1, 1, 1, currentPosition, boardArray);
        super.exploreDiag(-1, -1, 1, currentPosition, boardArray);
    }
}

class Queen extends Chesspiece {
    constructor(colour) {
        super(colour, "Queen")
    }

    getAvailableMoves(currentPosition, boardArray) {
        super.exploreY( 1, boardArray.length, currentPosition, boardArray);
        super.exploreY( -1, boardArray.length, currentPosition, boardArray);

        super.exploreX( 1, boardArray.length, currentPosition, boardArray);
        super.exploreX( -1, boardArray.length, currentPosition, boardArray);

        super.exploreDiag(1, 1, boardArray.length, currentPosition, boardArray);
        super.exploreDiag(1, -1, boardArray.length, currentPosition, boardArray);
        super.exploreDiag(-1, 1, boardArray.length, currentPosition, boardArray);
        super.exploreDiag(-1, -1, boardArray.length, currentPosition, boardArray);
    }
}

export { Pawn, Rook, Knight, Bishop, King, Queen }