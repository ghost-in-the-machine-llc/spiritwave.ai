import { Typewriter } from './dependencies.js';

const players = document.querySelectorAll('.player');
setTimeout(() => players.forEach(startOnVisible));

function getObserver(callback) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#creating_an_intersection_observer
    return new IntersectionObserver(callback, {
        rootMargin: '0px',
        threshold: 0.2,
    });
}

function startOnVisible(player) {
    const observer = getObserver((events) => {
        events.forEach(({ isIntersecting }) => {
            if (!isIntersecting) return;
            observer.unobserve(player);
            displayClips(player);
        });
    });
    observer.observe(player);
}

function displayClips(player) {
    const display = player.querySelector('.display');
    const clips = player.querySelectorAll('.clip');

    const typewriter = new Typewriter(display, {
        cursor: '',
        delay: 0,
        deleteSpeed: 0,
        skipAddStyles: true,
    });

    clips.forEach((c) => {
        const words = c.innerHTML.split(/\s+/);

        words.forEach((w, i) => {
            if (!w) return;
            if (w !== '<br>' && i) w = ' ' + w;
            const pause = getRandomInt(10, 150);
            typewriter.pasteString(w).pauseFor(pause);
        });

        typewriter
            .pauseFor(25000)
            .callFunction(({ elements: { wrapper } }) => {
                wrapper.innerHTML = '';
            });
    });

    typewriter.start().callFunction(() => {
        typewriter.stop();
        displayClips(player);
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}
