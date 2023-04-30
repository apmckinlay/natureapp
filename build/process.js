// Process the content files. Runs with node.js
// * convert group: in front matter to See Also: in content
// * convert references e.g. Raven(s) to links

// TODO need a way to prevent Grasshopper Hawk 
// from having Grasshopper turned into a link
// And Wolf in Wolf spiders
// (since the whole thing isn't linked to itself)

const fs = require('fs');

const generated = "<!-- generated, do not edit -->";

let id2name = {}; // e.g. "crow" => "Crow"
let id2path = {}; // e.g. "crow" => "animals/crow.md"
let name2id = {}; // e.g. "Crow" => "crow"
let groups = {};  // e.g. "corvid" => ["crow", "raven"]

let dirs = ['birds/', 'herps/', 'insects/', 'animals/', 'plants/', 'trees/']
for (let dir of dirs)
    forEachFile(dir, gatherInfo);
for (let dir of dirs)
    forEachFile(dir, updateFiles);

function forEachFile(dir, fn) {
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
    //console.log(path, x.name);
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
                    sa += '\n[' + id2name[said] + '](/' + id2path[said] + '/),';
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

    let names = Object.values(id2name);
    names.sort(function (a, b) {
        // sort by length so we process e.g. "Crab Spider" before "Crab"
        return b.length - a.length || a < b;
    });

    // change names to links
    for (let name of names) {
        let id2 = name2id[name];
        content = plurals(content, id2, name, link)
    }
    
    // remove links to current item
    let name = id2name[id];
    content = plurals(content, id, name, unlink)
    return front + content;
}

function plurals(content, id, name, fn) {
    content = fn(content, id, name);
    content = fn(content, id, name + "s");
    content = fn(content, id, name + "es");
    if (name.endsWith("ly"))
        content = fn(content, id, name.slice(0, -2) + "lies");
    if (name.endsWith("man"))
        content = fn(content, id, name.slice(0, -3) + "men");
    return content;
}

function link(content, id, name) {
    // Complicated by names that are a prefix/suffix of another.
    // Still won't handle a name that is inside another.
    let rx = RegExp('([^\\[]|^)\\b_*(' + name + ')_*\\b(?!])', 'g');
    return content.replace(rx,
        (str, pre, found) => pre + '[' + found + '](/' + id2path[id] + '/)');
}

function unlink(content, id, name) {
    let rx2 = RegExp('\\[(' + name + ')\\]\\(/' + id2path[id] + '/\\)', 'g');
    return content.replace(rx2, "$1");
}