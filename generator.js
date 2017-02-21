var BasicCard = require('./basic_flashcard.js');
var ClozeCard = require('./cloze_flashcard.js');
var inquirer = require('inquirer');
var fs = require('fs');

function generateBasicFlashcard() {
    inquirer.prompt([{
        type: 'input',
        message: 'What should go on the front of the card?',
        name: 'front'
    }, {
        type: 'input',
        message: 'What should go on the back of the card?',
        name: 'back'
    }]).then(function(response) {
        var newBasicFlashcard = new BasicCard(response.front, response.back);
        newBasicFlashcard.createCardJSON();
        console.log('Front: ' + newBasicFlashcard.front);
        console.log('Back: ' + newBasicFlashcard.back);
        startCLI();
    }).catch(function(err) {
        console.log(err);
    });
}

function generateClozeFlashcard() {
    inquirer.prompt([{
        type: 'input',
        message: 'What the full text of the card be?',
        name: 'fullText'
    }, {
        type: 'input',
        message: 'What should the cloze be?',
        name: 'fullCloze'
    }]).then(function(response) {
        var newClozeFlashcard = new ClozeCard(response.fullText, response.fullCloze);
        newClozeFlashcard.createClozeDeleted()
        console.log('Full text: ' + newClozeFlashcard.text);
        console.log('Cloze: ' + newClozeFlashcard.cloze);
        console.log('Full text with cloze deleted: ' + newClozeFlashcard.clozeDeleted);
        if (newClozeFlashcard.clozeDeleted !== '') {
            newClozeFlashcard.createCardJSON();
        } else {
            console.log('The cloze did not exist in the original text, and will not be saved.')
        }
        startCLI();
    }).catch(function(err) {
        console.log(err);
    });
}

var showCard = function(cardArray, cardIndex) {
    card = cardArray[cardIndex];
    var parsedCard = JSON.parse(card);
    var cardText = '';
    var answer = '';
    if (parsedCard.type === 'basicCard') {
        cardText = parsedCard.front;
        answer = parsedCard.back;
    } else if (parsedCard.type === 'clozeCard') {
        cardText = parsedCard.clozeDeleted;
        answer = parsedCard.cloze;
    }
    
    inquirer.prompt([{
        name: 'flashcard',
        message: cardText
    }]).then(function(response) {
        if (response.flashcard === answer) {
            console.log('Nicely done.');
        } else {
            console.log('NO!');
        }
    }).then(function(response) {
        if (cardIndex < cardArray.length - 1) {
            showCard(cardArray, cardIndex + 1);
        } else {
            startCLI();
        }
    }).catch(function(err) {
        console.log(err);
    });
};

function previousFlashcards() {
    fs.readFile('./log.txt', 'utf8', function(err, data) {
        if (err) {
            console.log('Error: ' + err);
        }
        var cards = data.split(';');
        var data = function(val) {
            return val;
        };
        cards = cards.filter(data);
        var cardNumber = 0;
        showCard(cards, cardNumber);
    });
}

function startCLI() {

    inquirer.prompt([{
        type: 'list',
        message: 'Welcome to your ultimate flashcard creating tool! Please choose an option:',
        choices: ['Add a new flashcard', 'Show all previous flashcards', 'EXIT'],
        name: 'begin'
    }, {
        type: 'list',
        message: 'Would you like to create a basic flashcard, or a cloze card?',
        choices: ['Basic Flashcard', 'Cloze Flashcard'],
        name: 'cardType',
        
        when: function(response) {
            return response.begin === 'Add a new flashcard';
        }
    }]).then(function(response) {
        if (response.begin === 'Add a new flashcard') {
            if (response.cardType === 'Basic Flashcard') {
                generateBasicFlashcard();
            } else if (response.cardType === 'Cloze Flashcard') {
                generateClozeFlashcard();
            } else {
                console.log('Something has gone wrong with flashcard creation! Abort!!!');
            }
        } else if (response.begin === 'Show all previous flashcards') {
            previousFlashcards();
        } else if (response.begin === 'EXIT') {
            console.log('Goodbye');
            return;
        } else {
            console.log('Something has gone wrong with displaying the JSON object! Abort!!!');
            return;
        }
    }).catch(function(err) {
        console.log(err);
    });
}

startCLI();
