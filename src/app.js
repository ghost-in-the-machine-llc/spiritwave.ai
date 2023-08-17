// import('./support-us.js');

// const writeToDOM = (node) =>
//     new WritableStream({
//         write(chunk) {
//             node.append(chunk);
//         },
//     });

class DOMAppendStream extends WritableStream {
    constructor(node) {
        super({
            write(chunk) {
                node.append(chunk);
            },
        });
    }
}

const API = '/.netlify/functions/hello';
const { body } = await fetch(API);

const output = document.getElementById('output');

body
    .pipeThrough(new TextDecoderStream())
    .pipeTo(new DOMAppendStream(output));
