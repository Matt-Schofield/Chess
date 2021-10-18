import ChessBoard from "./classes/Chessboard.js"

let Board, cvs;
let icons = [];

const CANVAS_SIZE = 800;
const SQUARE_COUNT = 8;

function preload() {
    // I just realised that I don't need this hardcoded, the sys stores these in
    // alphabetical order so I could process this, removing the need for two similar
    // arrays (other is in Chessboard.js)
    let fileSysImageOrder = ["Bishop", "King", "Knight", "Pawn", "Queen", "Rook"]

    // Load all images into an array with an identifier
    for (let imageIndex = 0; imageIndex < 6; imageIndex++) {
        icons.push({
            name: `Black${fileSysImageOrder[imageIndex]}`,
            val: loadImage(`../img/pieces/Black${fileSysImageOrder[imageIndex]}.svg`)
        });
    }

    for (let imageIndex = 0; imageIndex < 6; imageIndex++) {
        icons.push({
            name: `White${fileSysImageOrder[imageIndex]}`,
            val: loadImage(`../img/pieces/White${fileSysImageOrder[imageIndex]}.svg`)
        });
    }
}

function setup() {
    // Create canvas
    cvs = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    
    // Set board LIGHT colour
    background(227, 229, 232, 100);
    
    // Initialise chessboard object and then generate the
    // chessboard graphic.
    Board = new ChessBoard(SQUARE_COUNT, CANVAS_SIZE);   
    
    // Add click listener on canvas
    cvs.mousePressed(function() {
        Board.GET_SELECTED_SQUARE();
    });
}

function draw() { 
    /*Amongoose*/
}

// P5JS is bound to the window by default below
// is a workaround for the use of P5 in modules
window.preload = preload;
window.setup = setup;
window.draw = draw;
// window.mouseClicked = mouseClicked;

export { icons }