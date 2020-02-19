  // create  card constructor
  card = function(value, suit) {
    this.value = value;
    this.suit = suit;
  }
  card.prototype.getImageUrl = function() {
    let value = this.value;
    let suit = this.suit;
    let cardNames = {
      11: 'jack', 12: 'queen', 13: 'king', 1: 'ace'
    };
    if (value > 10 || value === 1) {
      value = cardNames[value];
    }
    return 'images/' + value+ '_of_' + suit + '.png';
  }

  // create Hand Constructor
  function hand() {
    this.cards = [];
  }
  hand.prototype.getValues = function() {
    let length = this.cards.length;
    let counter = 0;
    let count_1 = false;
    let cardValues = this.cards.reduce(function(totalValues, card) {
      if (card.value > 10) {
        card.value = 10;
      }
      counter++;
      totalValues+= card.value;
      if (card.value === 1) {
        count_1 = true;
      }
      if (counter === length) {
        if (totalValues <= 11 && count_1) {
          totalValues += 10;
        }
      }
      return totalValues;
        }, 0);
        return cardValues;
      }
        hand.prototype.addCard = function(newCard) {
        this.cards.push({value: newCard.value, suit: newCard.suit});
      };

  // Create Deck Constructor
  function deck() {
    this.currentDeck = [];
  }
  // create a new deck of cards
  deck.prototype.newDeck = function() {
    for (let i = 0; i < 4; i++) {
      let suit = {
        0: 'hearts', 1: 'diamonds', 2: 'clubs', 3: 'spades'
      }
        // save into currentDeck
      for (let k = 1; k <= 13; k++) {
        this.currentDeck.push(new card( k, suit[i]) );
      }
    }
  }
    deck.prototype.draw = function() {
      // draw the first card from the deck
    let drawnCard = this.currentDeck[0];
      // remove the first card from the deck
    this.currentDeck.splice(0, 1);
        return drawnCard;
  }

  // shuffle deck
  deck.prototype.shuffle = function() {
    let i = 0, j = 0, temp = null;
      for (i = this.currentDeck.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this.currentDeck[i];
        this.currentDeck[i] = this.currentDeck[j];
        this.currentDeck[j] = temp;
    }
  }

  deck.prototype.numCardsLeft = function() {
    return this.newDeck.length;
  }

  deck.prototype.deal = function(handSelector, currentHand, whole) {
    let cardImg = "";
    let text = "";

    // draw first card
    let  myCard = this.draw();

    // add card to player hand
    currentHand.cards.push(myCard);

    // too see if dealer has whole card
    if (!whole) {
      cardImg = '<img class="card" src="' + myCard.getImageUrl() + '" alt="" />';
      text = currentHand.getValues();
    } else {
      cardImg = '';
      text = '';
    }

    // render the image on the page
    $("#"+ handSelector +"-hand").append(cardImg);

    // update the current player's point count that is being displayed
    $('#' + handSelector + '-values').text(text);

  }

  // Create Game Constructor
  function Game() {
    this.dealerhand = new hand();
    this.playerhand = new hand();
    this.mydeck = new deck();
  }

  Game.prototype.deal = function() {
    // once the deal button has been clicked, undisable the other buttons
    $("#hit-button").prop('disabled', false);
    $("#stand-button").prop('disabled', false);
    $("#newgame-button").prop('disabled', false);

    // generate a new deck of cards
    this.mydeck.newDeck();

    // shuffle the deck
    this.mydeck.shuffle();

    // deal 4 times => order: Player, Dealer, Player, Dealer
    this.mydeck.deal('player', this.playerhand);
    this.mydeck.deal('dealer', this.dealerhand);
    this.mydeck.deal('player', this.playerhand);
    this.mydeck.deal('dealer', this.dealerhand, 'whole');

    // check if dealer or player gets blackjack
    this.blackjackCheck();

    // disable the deal button once everyone has been dealt 2 cards each
    $("#deal-button").prop('disabled', true);
  }

  Game.prototype.blackjackCheck = function() {
    // check if dealer or player gets blackjack
    if (this.playerhand.getValues() === 21 || this.dealerhand.getValues() === 21) {
      if (this.playerhand.getValues() === 21) {
        $('#messages').text("BLACKJACK! It is LiTT Yo!");
      } else {
        this.revealDealerWholeCard();
        $('#messages').text("Dealer has Blackjack...");
      }
      $("#hit-button").prop('disabled', true);
      $("#stand-button").prop('disabled', true);
    }
  }

  Game.prototype.revealDealerWholeCard = function() {
    // remove dealer's Whole card (back image)
    $('#dealer-whole-card').remove();

    // add dealer's Whole card (front image)
    $('#dealer-hand').append('<img class="card" src="' + this.dealerhand.cards[1].getImageUrl() + '" alt="card image" />');

    // update dealer's points to display current points
    $('#dealer-values').text(this.dealerhand.getValues());
  }

  Game.prototype.hit = function() {

    this.mydeck.deal('player', this.playerhand);

    // check if player busted
    if (this.playerhand.getValues() > 21) {
      $('#messages').text("You went over! Go ask your mommy for milk money!");
      $("#hit-button").prop('disabled', true);
      $("#stand-button").prop('disabled', true);
    }
  }

  Game.prototype.getWinner = function() {
    let message = "";

    // determine the winner
    if (this.dealerhand.getValues() === this.playerhand.getValues()) {
      message = " Tied!";
    }  else if (this.dealerhand.getValues() > 21) {
      message = "Dealer went over! You win, It is LiTT!";
    } else if (this.dealerhand.getValues() > this.playerhand.getValues()) {
        message = "Dealer wins!";
    } else {
      message = "You win!";
    }

    // render message on the page
    $('#messages').text(message);
  }

  Game.prototype.stand = function() {

    this.revealDealerWholeCard();

    // check if dealer has a minimum of 17
    if (this.dealerhand.getValues() < 17) {
      while(this.dealerhand.getValues() < 17) {
        console.log('reached the while loop');
        this.mydeck.deal('dealer', this.dealerhand);
        $('#dealer-points').text(this.dealerhand.getValues());

      }
    }

    // determine the winner
    this.getWinner();

    // disable hit and stand buttons
    $("#hit-button").prop('disabled', true);
    $("#stand-button").prop('disabled', true);

  }

  Game.prototype.newgame = function() {
    // clear the cards from the deck
    this.mydeck.currentDeck = [];

    // instantiate a new game
    game = new Game();

    // remove cards from the table
    $("#player-hand").empty();
    $("#dealer-hand").empty();

    // shuffle the deck
    this.mydeck.shuffle();

    // reset cards and points
    this.dealerhand.cards = [];
    this.dealerhand.points = 0;
    this.playerhand.cards = [];
    this.playerhand.points = 0;


    // create a new game
    let game = new Game();

    $("#deal-button").click(function() {
      game.deal();
    });
    $("#hit-button").click(function() {
      game.hit();
    });
    $("#stand-button").click(function() {
      game.stand();
    });
    $("#newgame-button").click(function() {
      game.newgame();
    });


    // remove all messages and point displays
    $("#dealer-points").text("");
    $("#player-points").text("");
    $('#messages').text("");

    // enable buttons
    $("#deal-button").prop('disabled', false);

    // disable stand buttons
    $("#hit-button").prop('disabled', true);
    $("#stand-button").prop('disabled', true);
    $("#newgame-button").prop('disabled', true);
  }

// });
