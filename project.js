let scoreP = 0; 
let scoreD = 0; 
let hidden = true;
let playerHand = [];
let dealerHand = [];
let deck = [];

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];
  
    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); // gets element from value array and types array and "joins" them together to "create" a card that matches the names of images.
        }
    }
    console.log(deck);
}
  
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}
  
function startGame() {
    // Deal cards to player and dealer
    for (let i = 0; i < 2; i++) {
        playerHand.push(deck.pop());
        dealerHand.push(deck.pop());
    }

    // Display player's cards
    displayCards("player", playerHand);

    // Display dealer's cards
    displayCards("dealer", dealerHand);

    // Calculate and save the value of player's and dealer's hands
    scoreP = calculateHandValue(playerHand);
    scoreD = calculateHandValue(dealerHand);
}

function displayCards(player, hand) {
    let playerDiv = document.getElementById(player + "-hand");
    playerDiv.innerHTML = "";

    for (let i = 0; i < hand.length; i++) {
        let cardImage = document.createElement("img");

        if (player === "dealer" && i === 0 && hidden) {
            cardImage.src = "cards/BACK.png"; // Display back of card image for the hidden dealer card
        } else {
            cardImage.src = "cards/" + hand[i] + ".png";
        }

        playerDiv.appendChild(cardImage);
    }
}

// Hand is an argument that we use as a placeholder for playerHand and dealerHand
function calculateHandValue(hand) {
    let totalValue = 0;
    let hasAce = false;
 
    for (let i = 0; i < hand.length; i++) {
        let card = hand[i];
        let value = card.split("-")[0]; // Extract the card value, 2-C gets divided to ['2','C'] and we are using the [0], therefore the first element which is the value
        if (!isNaN(parseInt(value))) {
            totalValue += parseInt(value);
        } else if (value !== "A") {
            totalValue += 10;
        } else {
            hasAce = true;
        }
    }

   
    if (hasAce) {
        if (totalValue + 11 <= 21) {
            totalValue += 11;
        } else {
            totalValue += 1;
        }
    }

    return totalValue;
}

function hit() {
    playerHand.push(deck.pop());
    displayCards("player", playerHand);
    scoreP = calculateHandValue(playerHand);

    
    if (scoreP > 21) {
        endGame();
    }
}

function stand() {
    revealDealerCard();

    // Dealer's turn to draw cards until the dealer's score is at least 17
    while (scoreD < 17) {
        dealerHand.push(deck.pop());
        scoreD = calculateHandValue(dealerHand);
        displayCards("dealer", dealerHand);
    }

    
    endGame();
}

function revealDealerCard() {
    hidden = false;
    displayCards("dealer", dealerHand);
}

function endGame() {
    document.getElementById("hit").disabled = true;
    document.getElementById("stand").disabled = true;
    let message = "";

    if (scoreP > 21) {
        message = "Player busts! Dealer wins!";
    } else if (scoreD > 21) {
        message = "Dealer busts! Player wins!";
    } else if (scoreP > scoreD) {
        message = "Player wins!";
    } else if (scoreP < scoreD) {
        message = "Dealer wins!";
    } else {
        message = "It's a tie!";
    }

    document.getElementById("message").innerHTML = message;

    // Reset the game after a delay to allow the player to see the result
    setTimeout(resetGame, 3000); // 3 seconds delay
}




function resetGame() {
    scoreP = 0;
    scoreD = 0;
    hidden = true;
    playerHand = [];
    dealerHand = [];
    deck = [];

    document.getElementById("player-hand").innerHTML = "";
    document.getElementById("dealer-hand").innerHTML = "";
    document.getElementById("message").innerHTML = "";

    buildDeck();
    shuffleDeck();
    startGame();
    document.getElementById("hit").disabled = false;
    document.getElementById("stand").disabled = false;
}
