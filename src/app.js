// import('./support-us.js');

const output = document.getElementById('output');

const writableStream = new WritableStream({
    // Implement the sink
    // async start(controller) {
    //     console.log(controller);
    // },
    async write(chunk) {
        // const [, data] = chunk.split('data: ', 2);
        // const message = JSON.parse(data);
        // output.append(message.choices[0].delta.content ?? '');
        // let listItem = document.createElement('li');
        // listItem.textContent = chunk;
        // console.log(chunk);
        output.append(chunk);
    },
});

const API = '/.netlify/functions/hello';

const { body } = await fetch(API);

body.pipeThrough(new TextDecoderStream()).pipeTo(writableStream);
// readStream(two, document.getElementById('list'));
