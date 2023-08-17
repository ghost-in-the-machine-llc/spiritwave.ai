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
        let listItem = document.createElement('li');
        listItem.textContent = chunk;
        output.append(listItem);
    },
    close() {
        console.log('dom write stream complete');
    },
    abort(err) {
        console.log('Sink error:', err);
    },
});

const API = '/.netlify/functions/hello';

const { body } = await fetch(API);

const [one, two] = body
    .pipeThrough(new TextDecoderStream())
    .tee();

one.pipeTo(writableStream);
readStream(two, document.getElementById('list'));

function readStream(stream, list) {
    const reader = stream.getReader();
    // let charsReceived = 0;

    // read() returns a promise that resolves
    // when a value has been received
    reader.read().then(function processText({ done, value }) {
        // Result objects contain two properties:
        // done  - true if the stream has already given you all its data.
        // value - some data. Always undefined when done is true.
        if (done) {
            console.log('Stream complete');
            return;
        }

        console.log(value);
        // charsReceived += value.length;
        const chunk = value;
        let listItem = document.createElement('li');
        listItem.textContent = 'reader Current chunk = ' + chunk;
        list.appendChild(listItem);

        // Read some more, and call this function again
        return reader.read().then(processText);
    });
}
