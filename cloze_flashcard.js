var fs = require('fs');

function ClozeCard(text, cloze) {
    this.text = text;
    this.cloze = cloze;
    this.clozeDeleted = '';

    this.createClozeDeleted = function() {
        if (this.text.indexOf(this.cloze) >= 0) {
            this.clozeDeleted = this.text.replace(this.cloze, '...');
        } else {
            console.log('ERROR: YOU DID SOMETHING WRONG')
        }
    };

    this.createCardJSON = function() {

        var data = {
            text: this.text,
            cloze: this.cloze,
            clozeDeleted: this.clozeDeleted,
            type: 'clozeCard'
        };
     
        fs.appendFile('log.txt', JSON.stringify(data) + ';', 'utf8', function(err) {
            if (err) {
                console.log(err);
            }
        });
    };
}

module.exports = ClozeCard;
