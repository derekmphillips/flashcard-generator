var fs = require('fs');

function BasicCard(front, back) {
    this.front = front;
    this.back = back;

    this.createCardJSON = function() {
        var data = {
            front: this.front,
            back: this.back,
            type: 'basicCard',
        };
        
        fs.appendFile('log.txt', JSON.stringify(data) + ';', 'utf8', function(err) {
            
            if (err) {
                console.log(err);
            }
        });
    };
}


module.exports = BasicCard;
