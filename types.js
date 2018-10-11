const fs = require('fs');

module.exports = {
    operations: '+,*,/,-,:='.split(','),
    logic: '||,&&'.split(','),
    relop: '<,>,<=,>=,==,!=,='.split(','),
    keywords: fs.readFileSync('./data/keywords.csv', { encoding: 'utf8'}).split(',')
}