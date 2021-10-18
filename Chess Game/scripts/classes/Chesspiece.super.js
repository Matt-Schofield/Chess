export default class Chesspiece {
    constructor(colour, type) {
        // Piece name
        this.colour = colour;
        this.type = type;
        this.name = this.colour + this.type;

        // Initialise array to hold available moves
        this.availableMoves = [];
    }

    // Direction is 1 => explore DOWN
    // Direction is -1 => explore UP 
    exploreY(direction, amount, currentPosition, boardArray) {
        for (let count = 1; count < Math.abs(amount) + 1; count++) {

            // Get the square currently being iterated over
            let potentialMove = { X: currentPosition.X, Y: currentPosition.Y + (count * direction) };

            // Check square checks if the given move is valid, and returns whether or not
            // to keep checking to the variable
            let keepChecking = this.checkSquare(potentialMove, boardArray);

            if (keepChecking == false) {
                break
            }
        }
    }

    // Direction is 1 => explore RIGHT
    // Direction is -1 => explore LEFT
    exploreX(direction, amount, currentPosition, boardArray) {
        for (let count = 1; count < Math.abs(amount) + 1; count++) {

            // Get the square currently being iterated over
            let potentialMove = { X: currentPosition.X + (count * direction), Y: currentPosition.Y };
            
            // Check square checks if the given move is valid, and returns whether or not
            // to keep checking to the variable
            let keepChecking = this.checkSquare(potentialMove, boardArray);
            
            if (keepChecking == false) {
                break
            }
        }
    }
    
    exploreDiag(vDirection, hDirection, amount, currentPosition, boardArray) { 
        for (let count = 1; count < Math.abs(amount) + 1; count++) {
            
            // Get the square currently being iterated over
            let potentialMove = { X: currentPosition.X + (count * hDirection), Y: currentPosition.Y + (count * vDirection)};
        
            // Check square checks if the given move is valid, and returns whether or not
            // to keep checking to the variable
            let keepChecking = this.checkSquare(potentialMove, boardArray);
            
            if (keepChecking == false) {
                break
            }
        }
    }
    
    checkSquare(potentialMove, boardArray) {
        // Square is outside the range of the board
        if (potentialMove.X >= boardArray.length || potentialMove.Y >= boardArray.length ||
            potentialMove.X < 0|| potentialMove.Y < 0) {
            return false
        }
        // Square is empty and it can be moved into 
        else if (boardArray[potentialMove.Y][potentialMove.X] == "") {
            this.availableMoves.push(potentialMove);
            return true
        }
        // Square is on the enemy team and it can be moved into
        else if (boardArray[potentialMove.Y][potentialMove.X].colour != this.colour) {
            this.availableMoves.push(potentialMove)
            return false
        }
        // Square is on the same team
        else {
            return false
        }
    }
}