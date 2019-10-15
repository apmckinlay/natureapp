// scan the files to find words to index

const fs = require('fs');

const generated = "<!-- generated, do not edit -->";

let wordcount = {} // word => number of entries containing it

index('birds/');
index('herps/');
index('insects/');
index('animals/');
index('plants/');
index('trees/');

function index(dir) {
    forEachFile(dir, scan);
    let list = []
    for (w in wordcount)
        list.push([wordcount[w], w]);
    list.sort(function (a, b) { return a[0] - b[0] })
    for (x of list)
        console.log(x[0] + "\t" + x[1])
}

function forEachFile(dir, fn) {
    fs.readdirSync(dir).forEach(file => {
        if (file.endsWith('.md')) {
            let id = file.slice(0, -3); // strip '.md'
            let content = fs.readFileSync(dir + file, 'utf8');
            fn(dir + file, id, content);
//process.exit(0);
        }
    });
}

function scan(path, id, content) {
    // console.log(path);

    // remove front matter
    let i = content.indexOf("---", 4);
    content = content.slice(i);

    // remove see also
    i = content.indexOf(generated)
    content = content.slice(0, i);

    // remove links
    let rx = /\[(.*?)\]\(.*?\)/g;
    content = content.replace(rx, "$1");

    //console.log(content);

    content = content.toLowerCase();
    words = new Set(content.split(/[^a-z]+/));
    for (var w of words) {
        if (w.length > 1) {
            wordcount[w] = wordcount[w] || 0;
            wordcount[w]++
        }
    }
}
