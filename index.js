//Card set game that runs until player picks a wrong set. Player gets a fixed amount of time total.
//Player will be shown a board with 9 cards and attempt to choose 'sets'--3-card combinations that
//Feature 1 property that is shared and the other 2 unique or all properties unique.
//A false-set results in gameover state. Game keeps track of total sets matched.

let deckArray = [];
let playDeck = [];
let currentBoard;
let cardsRemaining = 0;
let selectedNum = 0;
let drawnNum = 0;
let currentScore = 0;
let currentWrong = 0;
let gameStarted = false;

//Generate the array of cards
//Each card is unique with 3 visual properties in 3 states: color, shape, number (27 total cards)
function generateDeck() {
    let cardIndex = 0;
    for (let cardColor = 0; cardColor < 3; cardColor++){
        for (let cardShape = 0; cardShape < 3; cardShape++) {
            for (let cardNum = 0; cardNum < 3; cardNum++) {
                deckArray.push(card = {
                    "index": cardIndex,
                    "num": cardNum,
                    "shape": cardShape,
                    "color": cardColor
                });
                cardIndex++;
            }
        }
    }
    console.log("=-=-=-=-=-=Deck Made=-=-=-=-=-=")
}

//Function that clears the playDeck
function emptyDeck() {
    playDeck = [];
    console.log("=-=-=-=-=-=Deck Emptied=-=-=-=-=-=")
}

//"Shuffle" the card deck by randomizing the array
function shuffleDeck() {
    let tempDeck = [...deckArray];
    let shuffleIndex = 0;
    playDeck = [];
    currentBoard = new Array(12);
    for (let drawnNum = 0; drawnNum < deckArray.length; drawnNum++){
        let randomDraw = Math.floor(Math.random()*tempDeck.length)
        console.log(`=-=-=-=-=-==-=-${randomDraw} was drawn=-=-=-=-=-==-=-`)
        let pickedDraw = tempDeck[randomDraw];
        pickedDraw.index = shuffleIndex;
        shuffleIndex++;
        playDeck.push(pickedDraw);
        tempDeck.splice(randomDraw, 1);
    }
    cardsRemaining = playDeck.length;
    console.log("=-=-=-=-=-=Deck Shuffled=-=-=-=-=-=");
}


//Timer
let timer = {
    totalTime: 0,
    elapsedTime: 0,
    Start: function (){
        let i = 0;
        setTimeout(i++, 1000);
    },
    Pause: function (){

    }
}


//  Draws cards into an array to be used for the current play board. Replaces undefined at indecies and up to full board.
function drawCards(array) {
    let currentDraw
    // Reads all values of the board and replaces undefined with first card in playdeck.
    for (currentDraw = 0; currentDraw < currentBoard.length; currentDraw++) {
        if ((currentBoard[currentDraw] === undefined) && (playDeck.length > 0)) {
            let newCard = playDeck[0];
            currentBoard[currentDraw] = newCard;
            playDeck.splice(0, 1);
         }   
    }
    console.log(currentBoard);
    console.log(playDeck);
    console.log(`=-=-=-=-=${currentDraw} cards were drawn=-=-=-=-=`)
    console.log(`=-=-=-=-=There are ${playDeck.length} cards left=-=-=-=-=`);
    
}


//  Render board based on the currentBoard array. [row] [column] indexed.
//  Conditionals for each data state will apply a css class.
//  For outer index, for inner index: if card exists on currentBoard, append div with class strings for each condition.
function renderBoard(template, node) {
    const rowSize = 3;
    const colSize = 4;
    const boardSize = 12;
    let drawnNum = 0;    
    let colors = ["color1", "color2", "color3"];
    let shapes = ["shape1", "shape2", "shape3"];
    let numbers = ["num1", "num2", "num3"];

    if (!node) return;
    node.empty();

    while ((drawnNum < boardSize) && (drawnNum < currentBoard.length)) {
        for (let outerIndex = 0; outerIndex < rowSize; outerIndex++){
            node.append(`
            <div class="row" id="row${outerIndex}">
            </div>`);

            for (let innerIndex = 0; innerIndex < colSize; innerIndex++){
                let currentCard = currentBoard[drawnNum];

                if (currentBoard[drawnNum] === undefined) {
                    $(`#row${outerIndex}`).append(`
                    <div class="card blank-card" data-selected="2">
                    </div>
                `);
                }

                else {
                    $(`#row${outerIndex}`).append(`
                        <div class="card" data-pos="${drawnNum}" data-selected="0"
                        data-color="${currentCard.color}" data-num="${currentCard.num}" data-shape="${currentCard.shape}">
                        </div>
                    `);

                    for (let multi = 0; multi < (currentCard.num+1); multi++) {  

                        if (currentCard.shape == 0) {
                            $(`#row${outerIndex} .card:eq(${innerIndex})`).append(`
                            <div class="symbol ${colors[currentCard.color]} ${numbers[currentCard.num]}"><i class="fa-solid fa-circle"></i>
                            </div>
                        `);}

                        else if (currentCard.shape == 1) {
                            $(`#row${outerIndex} .card:eq(${innerIndex})`).append(`
                            <div class="symbol ${colors[currentCard.color]} ${numbers[currentCard.num]}"><i class="fa-solid fa-square"></i>
                            </div>
                        `);}

                        else if (currentCard.shape == 2) {
                            $(`#row${outerIndex} .card:eq(${innerIndex})`).append(`
                            <div class="symbol ${colors[currentCard.color]} ${numbers[currentCard.num]}"><i class="fa-solid fa-star"></i>
                            </div>
                        `);}

                    }
                }
                drawnNum++;
            }
        }
    }
}


//  Listener for when clicking on cards. Checks for a valid set when 3 cards are selected.
$("#boardContainer").on("click", ".card", function() {
    let currentCard = $(this);
    let firstCard;
    let secondCard;
    let thirdCard;
    let systemMsg = "";
    console.log(currentCard);

    if (gameStarted) {

        //  Removes the invalid-set class when picking a new set after a wrong one
        $(".invalid-set").each(function() {
            $(this).removeClass("selected");
        });
        

        //  Selects/deselects cards before 3 are selected
        if (selectedNum < 3) {
            $(".invalid-set").each(function() {
                $(this).removeClass("invalid-set");
            });
            if (currentCard.data().selected === 0) {
                currentCard.addClass("selected");
                currentCard.data().selected++;
                selectedNum++;
            }

            else if (currentCard.data().selected === 1) {
                currentCard.removeClass("selected");
                currentCard.data().selected = 0;
                selectedNum--;
            }
        }

        //  Checks for a match and does this logic once 3 cards selected
        if (selectedNum === 3) {
            $(".selected").each(function() {
                if (firstCard === undefined) {
                    firstCard = $(this)
                }
                else if (secondCard === undefined) {
                    secondCard = $(this)
                }
                else if (thirdCard === undefined) {
                    thirdCard = $(this);
                }
            });
            console.log("=-=-=-=-=-=3 Selected=-=-=-=-=-=");
            console.log(firstCard, secondCard, thirdCard);

            //  If the set is valid: increment score, remove the set, and reset variables
            if (checkSet(firstCard, secondCard, thirdCard)) {
                removeSet(firstCard, secondCard, thirdCard);
                currentScore++;
                $(".selected").each(function() {
                    $(this).data().selected = 0;
                    $(this).removeClass("selected");
                })
                drawCards(currentBoard);
                renderBoard(currentBoard, $("#boardContainer"));
                systemMsg = "You found a set!"
                updateUi(systemMsg);            
            }

            //  If the set is not valid: applies styling to the invalid set and sets data of cards to deselected.
            else {
                $(".selected").each(function() {
                    $(this).addClass("invalid-set");
                });
                currentWrong++;
                $(".invalid-set").each(function() {
                    $(this).data().selected = 0;
                });
                systemMsg = "This is not a valid set. Select new cards!";
                updateUi(systemMsg);
            }

            //  Resets variables
            selectedNum = 0;
            firstCard = undefined;
            secondCard = undefined;
            thirdCard = undefined;
            
        }
    }
});

//  Listener for the UI button within ui div. Starts a new game on press.
$(document).on("click", ".button", function() {
    console.log($(this));
    gameStart();
});

//  Function for checking the data in all 3 criteria. The states/values should all sum to 0, 3, or 6 (all the same or all unique)
function checkSet(card1, card2, card3) {
    let validSum = [0, 3, 6];
    let colorSum = card1.data().color + card2.data().color + card3.data().color
    let shapeSum = card1.data().shape + card2.data().shape + card3.data().shape
    let numSum = card1.data().num + card2.data().num + card3.data().num 
    console.log("=-=-=-=-Verifying match=-=-=-=-=-");

    if (!validSum.includes(colorSum)) {
        console.log("These colors are not a set!");
    }
    if (!validSum.includes(shapeSum)) {
        console.log("These shapes are not a set!");
    }
    if (!validSum.includes(numSum)) {
        console.log("These numbers are not a set!");
    }
    else if ((validSum.includes(numSum)) && (validSum.includes(shapeSum)) && (validSum.includes(colorSum))) {
        console.log("This is a set!")
        return true;
    }
    else {
        return false;
    }
}

//  Function that removes a matched set from the currentBoard using data and iterating 3 times to splice
function removeSet(first, second, third){
    let removePositions = [first.data().pos, second.data().pos, third.data().pos];
    for (let i = 0; i < 3; i++){
        currentBoard[removePositions[i]] = undefined;
    }

}

//  Function that updates the UI
function updateUi(msg) {
    let ui = $("#ui");
    ui.empty();
    
    if (gameStarted === false) {
        ui.append(`<p>${msg} &nbsp </p>
        <p class="ui-text"> Your score is: ${currentScore} </p>
        <p class="ui-text> Your number wrong is: ${currentWrong} </p>
        <button class="button new-board">New Game</button>
        `);
    }

    else if (currentScore === 9) {
        msg = "Congrats! You cleared the board";
        ui.append(`
        <p class="ui-text"> ${msg} &nbsp </p>
        <p class="ui-text"> Your score is: ${currentScore}! </p>
        <p class="ui-text"> Your number wrong is: ${currentWrong}</p>
        <button class="button new-board">New Game</button>
        `)
        gameOver();
    }

    else {
        ui.append(`
        <p class="ui-text"> ${msg} &nbsp </p>
        <p class="ui-text"> Your current score is: ${currentScore} </p>
        <p class="ui-text"> Your number wrong is: ${currentWrong} </p>
        <button class="button new-board">New Game</button>
        `);
    }

}


//  Function that starts the game by making deck, shuffling, drawing cards, and rendering
function gameStart(){
    gameStarted = true;
    currentScore = 0;
    currentWrong = 0;
    systemMsg = "";
    shuffleDeck();
    drawCards(currentBoard);
    renderBoard(currentBoard, $("#boardContainer"));
    updateUi(systemMsg);
}

//  Function that does all the gameOver state changes
function gameOver() {
    gameStarted = false;
}

generateDeck();
gameStart();