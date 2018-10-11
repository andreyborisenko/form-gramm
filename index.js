const types = require('./types');
const printf = require('printf');
const phrase = "T1 := T2 ITERSECT (EML union T2 WHERE SALARY > 4015 AND code = 4015)";

const id1Regex = /^[A-Za-z][A-Za-z0-9]*$/;
const id3Regex = /^[A-Za-z][A-Za-z0-9_]*$/;
const numRegex = /^\d+$/;

function defineType(m) {
    for (type in types) {
        if (types[type].includes(m.toUpperCase())) {
            return type
        }
    }

    if (id1Regex.test(m) || id3Regex.test(m)) return 'id'

    if (numRegex.test(m)) return 'num'

    return 'none'
}

function parseLexeme(m, offset) {
    const type = defineType(m),
        begin = phrase.indexOf(m, offset) + 1,
        length = m.length

    return {
        value: m,
        type,
        begin,
        length
    }
}


let foundTypes = {
    id: [],
    num: [],
    none: [],
    position: 1,
    add(lexeme) {
        const { type } = lexeme;
        if (!Object.keys(this).includes(type)) {
            return false
        }

        let foundLexeme = this[type].find(x => x.value == lexeme.value)
        lexeme.position = foundLexeme ? foundLexeme.position : this.position++

        this[type].push(lexeme)
    },
    getAllLexemes() {
        let out = []

        for (let type of Object.getOwnPropertyNames(this)) {
            if (!(this[type] instanceof Array)) continue
            out.push(...this[type])
        }

        return out.sort((a, b) => a.begin - b.begin)
    },
    ...types
}

for (let type in foundTypes) {
    if (!(typeof foundTypes[type] == 'object')) continue
    foundTypes[type] = []
}

let offset = 0;

phrase.replace(/\s+/g, ' ').split(' ').map(x => x.replace(/[\(\),;]/g, '')).filter(x => x.length).forEach(x => {
    const lexeme = parseLexeme(x, offset)
    foundTypes.add(lexeme)
    offset += x.length
})

const maxTypeLength = Math.max(...foundTypes.getAllLexemes().map(x => x.type.length)),
    maxValueLength = Math.max(...foundTypes.getAllLexemes().map(x => x.value.length))

console.log(printf(`%-${maxTypeLength}s | %-${maxValueLength}s | %-7s | %-7s | %-10s`, 'TOKEN', 'VALUE', 'BEGIN', 'LENGTH', 'POSITION'));
console.log(
    foundTypes.getAllLexemes()
        .map(x => printf(`%-${maxTypeLength}s | %-${maxValueLength}s | %-7d | %-7d | %-10d`, 
            x.type , x.value , x.begin , x.length , x.position))
        .join('\n')
);