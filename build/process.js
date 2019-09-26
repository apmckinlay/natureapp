// Process the content files. Runs with node.js
// * convert group: in front matter to See Also: in content
// * convert references e.g. Raven(s) to links

const fs = require('fs');

const generated = "<!-- generated, do not edit -->";

let id2name = {}; // e.g. "crow" => "Crow"
let id2path = {}; // e.g. "crow" => "animals/crow.md"
let name2id = {}; // e.g. "Crow" => "crow"
let groups = {}; // e.g. "corvid" => ["crow", "raven"]

process('birds/');
process('herps/');
process('insects/');
process('animals/');
process('plants/');
process('trees/');

function process(dir) {
    forEachFile(dir, gatherInfo);
    console.log(name2id["Solomon's Seal"] + " = " + id2name['solomon'])
    console.log(name2id["False Solomon's Seal"] + " = " + id2name['falsesol'])
    forEachFile(dir, updateFiles);
}

function forEachFile(dir, fn) {
    // TODO handle directory tree
    fs.readdirSync(dir).forEach(file => {
        if (file.endsWith('.md')) {
            let id = file.slice(0, -3); // strip '.md'
            let content = fs.readFileSync(dir + file, 'utf8');
            fn(dir + file, id, content);
        }
    });
}

function gatherInfo(path, id, content) {
    let i = content.indexOf("---", 4);
    let x = front(content.slice(0, i));
    //console.log(id + " " + path.slice(0, -3));
    id2name[id] = x.name;
    id2path[id] = path.slice(0, -3)
    name2id[x.name] = id;
    if (x.group) {
        if (!groups[x.group])
            groups[x.group] = [];
        groups[x.group].push(id);
    }
}

function front(s) {
    let x = {};
    let lines = s.trim().split('\n');
    if ("---" != lines.shift())
        throw "missing leading ---";
    for (let line of lines) {
        let i = line.indexOf(':');
        let name = line.substr(0, i);
        let value = line.slice(i + 3, -1);
        x[name] = value;
    }
    return x;
}

function updateFiles(path, id, content) {
    let original = content;
    let i = content.indexOf(generated);
    if (i != -1)
        content = content.slice(0, i).trim() + '\n';
    content = namesToLinks(id, content);
    content = addSeeAlso(id, content);
    if (content != original) {
        console.log("updated: " + path);
        fs.writeFileSync(path, content, 'utf8');
    }
}

function addSeeAlso(id, content) {
    for (let list of Object.values(groups))
        if (list.length > 1 && list.includes(id)) {
            let sa = "**See Also:**";
            for (let said of list)
                if (said != id)
                    sa += '\n[' + id2name[said] + '](/' + id2path[said] + '),';
            sa = sa.slice(0, -1);
            content += '\n' + generated + '\n' + sa + '\n';
        }
    return content;
}

function namesToLinks(id, content) {
    let i = content.indexOf("---", 4);
    let front = content.slice(0, i);
    content = content.slice(i);
    
    // remove old links
    let rx = /\[(.*?)\]\(.*?\)/g;
    content = content.replace(rx, "$1");
    
    names = Object.values(id2name)
    names.sort(function (a, b) {
        return b.length - a.length || a < b
    });
    
    // add links
    for (let name of names) {
        id2 = name2id[name]
        if (id != id2 && content.includes(name)) {
            let rx = RegExp('([^\\[]|^)\\b_*(' + name + 's?)_*\\b(?!])', 'g');
            content = content.replace(rx,
                (str, pre, name) => pre + '[' + name + '](/' + id2path[id2] + ')');
        }
    }
    return front + content;
}
