// Based on http://jasonjl.me/blog/2015/06/21/taking-action-on-browser-crashes/

class CrashReporter {
    init({
        storageType = 'sessionStorage',
        autosaveTimeout = 3000,
        reportDetails = [ 'up-time', 'last-ok-time', 'last-url', 'prev-url', 'memory' ],
        reportCrash = () => {} }
    ) {
        this._autosaveTimeout = autosaveTimeout;
        this._storageInit(storageType);

        if (this.hasCrashed()) {
            reportCrash(this._getDetails(reportDetails));
        }

        this.initGoodExitHook();
        this.startAutosave();

        return this;
    }

    hasCrashed() {
        const goodExit = this._storage.get('good-exit');
        return Boolean(goodExit) && goodExit !== 'yes';
    }

    initGoodExitHook() {
        window.addEventListener('beforeunload', () => {
            this._storage.set('good-exit', 'yes');
        });
    }

    startAutosave() {
        this._storage.set('good-exit', 'pending');
        this._storage.set('start-time', Date.now());
        this._autosaver();
    }

    _autosaver() {
        this._storage.set('last-ok-time', Date.now());
        this._storage.set('last-url', window.location.href);
        this._saveMemoryUsage();

        setTimeout(this._autosaver.bind(this), this._autosaveTimeout);
    }

    _saveMemoryUsage() {
        if (!window.performance || !window.performance.memory) {
            return 'NOT_AVAILABLE';
        }

        const mem = window.performance.memory;
        this._storage.set('memory-usage', `limit=${mem.jsHeapSizeLimit} total=${mem.totalJSHeapSize} used=${mem.usedJSHeapSize}`);
    }

    _getDetails(details = []) {
        const now = Date.now();
        const data = {};
        const detailsGetters = {
            'up-time': (now) => (now - this._storage.get('start-time')),
            'last-ok-time': (now) => {
                const lastOkTime = this._storage.get('last-ok-time');
                return `${lastOkTime.toString()} (${lastOkTime})`;
            },
            'last-url': () => this._storage.get('last-url'),
            'prev-url': () => 'NOT_IMPLEMENTED',
            'memory': () => this._storage.get('memory-usage')
        };

        details.forEach((type) => {
            data[type] = detailsGetters[type](now);
        });

        return data;
    }

    _storageInit(storageType) {
        switch (storageType) {
            case 'sessionStorage':
                this._storage = {
                    set: (key, value) => {
                        sessionStorage.setItem(key, value);
                    },
                    get: (key) => {
                        return sessionStorage.getItem(key);
                    }
                };
                break;

            case 'localStorage':
                // we need some sort of tab id ...
                // because if we have N tabs opened we can get N reports about
                // crash while only one tab has crashed actually.
        }
    }
}
