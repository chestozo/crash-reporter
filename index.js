class App {
    constructor() {
        [ 'stop', 'crashByMemory' ].forEach(method => this[method] = this[method].bind(this));
    }

    init() {
        // TODO buttons:
        // infinite loop
        // infinite ajax requests
        // infinite ajax sync requests

        const crashReporter = new CrashReporter().init({
            storageType: 'sessionStorage',
            reportCrash: function(details) {
                alert(`CRASHED\n${JSON.stringify(details)}`);
            }
        });

        this._onClick('#crash-by-memory', this.crashByMemory);
        this._onClick('#crash-by-memory-fast', this.crashByMemoryFast);
        this._onClick('#stop', this.stop);


        return this;
    }

    /**
     * - Chrome: no crash here after several minutes of run, just eating 2.3Gb of RAM on my Mac.
     */
    crashByMemory() {
        let str = '';
        while(true) {
            str += Math.random() + Math.random();
        }
    }

    /**
     * - Chrome: almost immediate crush with error "RangeError: Invalid string length".
     * The same can be achieved with big object JSON.stringify().
     */
    crashByMemoryFast() {
        let str = '';
        let tmp;
        while(true) {
            tmp = str;
            str += tmp + Math.random();
        }
    }

    stop() {
        throw new Error('stop app');
    }

    _onClick(selector, handler) {
        const node = document.querySelector(selector);
        node && node.addEventListener('click', handler);
    }
}

window.app = new App().init();
