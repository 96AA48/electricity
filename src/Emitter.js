class Emitter {
    constructor() {
        this.listeners = [];
    }

    emit(signal, data) {
        if (signal === 'Query') {
            data = data.replace(/\//, '').split(',');
        }

        for (var listener of this.listeners) {
            if (listener.signal === signal)
                listener.callback(data);
        }
    }

    del(index) {
        this.listeners.splice(index, 1);
    }

    on(signal, callback) {
        let index = this.listeners.length;
        this.listeners.push({
            signal,
            callback
        });

        return () => this.del(index);
    }
}

export default Emitter;
