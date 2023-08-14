// import('./support-us.js');

const API = '/.netlify/functions/hello';

const eventSource = new EventSource(API);

const addListener = (name) =>
    eventSource.addEventListener(name, (e) => {
        // console.log(name, e.data);
        if (name !== 'message') return console.log(name, e.data);
        if (e.data === '[DONE]') {
            return eventSource.close();
        }
        const message = JSON.parse(e.data);
        console.log(message.choices[0].delta.content);
    });

addListener('message');
addListener('open');
addListener('error');

// const res = await fetch(API);
// console.log(await res.json());
