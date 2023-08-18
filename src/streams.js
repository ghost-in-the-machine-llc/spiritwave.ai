
export class DOMAppendStream extends WritableStream {
    constructor(node) {
        super({
            write(chunk) {
                node.append(chunk);
            },
        });
    }
}

const phrase = /[!.?]/gm;

export class PhraseTransformStream extends TransformStream {
    constructor() {
        super({
            sentence: '',

            transform(chunk, controller) {
                const [match] = chunk.matchAll(phrase);
                if (match) {
                    this.sentence += chunk.slice(0, match.index + 1);
                    controller.enqueue(this.sentence);
                    this.sentence = chunk.slice(match.index + 1);
                }
                else {
                    this.sentence += chunk;
                }
            },

            flush(controller){
                if (this.sentence){
                    controller.enqueue(this.sentence);
                }
            }
        });
    }
}


const getVoices = () => speechSynthesis.getVoices();

const chooseVoice = voices => {
    const options = voices
        .filter(({ lang })=> lang === 'en-US')
        .sort(({ localService: a, name: na }, { localService: b, name: nb }) => {
            if (a === b) return nb > na; 
            else return +(a > b || -1);
        });
        
    return options.at(0) ?? null;
};

const tryGetVoice = () => {
    const voices = getVoices();
    return voices.length ? chooseVoice(voices) : null;
};

async function getVoice() {
    const voice = tryGetVoice();
    if (voice) return voice;

    return new Promise((resolve, reject) => {
        speechSynthesis.onvoiceschanged = () => {
            speechSynthesis.onvoiceschanged = undefined;
            const voice = tryGetVoice();
            voice ? resolve(voice) : reject(new Error('No voices found'));
        };
    });
}
  


const voiceReady = getVoice();

export class SpeakStream extends WritableStream {
    constructor() {
        super({
            async write(chunk) { 
                return new Promise((resolve) => {
                    const utter = new SpeechSynthesisUtterance(chunk);
                    async function run() {
                        utter.onend = resolve;
                        utter.onerror = console.error;
                        utter.onboundary = console.log;
                        
                        utter.voice = await voiceReady;
                        speechSynthesis.speak(utter);
                    } 
                    run();
                });
                
            },
        });
    }
}
