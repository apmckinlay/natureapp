// Build Lunr index

var lunr = require("../lunr.js");

const fs = require('fs');

var map = {}

var idx = lunr(function () {
    this.ref('id')
    this.field('name', { boost: 2 })
    this.field('body')
    
    index(this, 'birds/');
    index(this, 'herps/');
    index(this, 'insects/');
    index(this, 'animals/');
    index(this, 'plants/');
    index(this, 'trees/');
})
fs.writeFileSync("idx.js", "var idx = " + JSON.stringify(idx) + '\n')
fs.writeFileSync("map.js", "var map = " + JSON.stringify(map) + '\n')

function index(idx, dir) {
    fs.readdirSync(dir).forEach(file => {
        if (file.endsWith('.md')) {
            let id = file.slice(0, -3); // strip '.md'
            let content = fs.readFileSync(dir + file, 'utf8');
            add(idx, dir, id, content);
// process.exit();
        }
    });
}

// called for each item (file)
function add(idx, dir, id, content) {
    let name = content.match(/\nname: "([^"]*)"/)[1];
    let habitat = content.match(/\nhabitat: \[([^\]]*)\]/)[1].split(',');
    let location = content.match(/\nlocation: \[([^\]]*)\]/)[1].split(',');
    map[id] = [dir, name, habitat, location];
    let aka = content.match(/\naka: \[([^\]]*)\]/);
    if (aka)
        name += ' ' + aka[1].replace(/,/g, ' ');
    let keywords = content.match(/\nkeywords: \[([^\]]*)\]/);
    if (keywords)
        name += ' ' + keywords[1].replace(/,/g, ' ');
    if (dir == "birds/")
        name += ' ' + 'bird'
    
    let body = clean(content);
    
    idx.add({ 'id': id, 'name': name, 'body': body });
}


function clean(content) {
    // remove front matter
    let i = content.indexOf("---", 4);
    content = content.slice(i+4);

    // remove see also
    const generated = "<!-- generated, do not edit -->";
    i = content.indexOf(generated);
    content = content.slice(0, i);

    // remove links
    let rx = /\[(.*?)\]\(.*?\)/g;
    content = content.replace(rx, "$1");
    
    return content;
}