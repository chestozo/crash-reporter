class App {
    constructor() {
        [ 'stop', 'crashByMemory' ].forEach(method => this[method] = this[method].bind(this));
    }

    crashByMemory() {
        let str = '';
        while(true) {
            str += Math.random();
        }
    }

    stop() {
        throw new Error('stop app');
    }

    _onClick(selector, handler) {
        document.querySelector(selector).addEventListener('click', handler);
    }

    init() {
        this._onClick('#stop', this.stop);
        this._onClick('#crash-by-memory', this.crashByMemory);
        return this;
    }
}

window.app = new App().init();

// // Buttons
// memory
// infinite loop
// infinite ajax requests
// infinite ajax sync requests

// // try
// sessionStorage
// localStorage
// cookie?

// // crashReport
// upTime (time passed from app start time)
// memory? it is a bit difficult but possible
// current url
// prev url
