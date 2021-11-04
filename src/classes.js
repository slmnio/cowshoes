class Stream {
    constructor({ host, app, key }) {
        this.host = host;
        this.app = app;
        this.key = key;
    }
    get rtmpURL() {
        return `rtmp://${this.host}/${this.app}/${this.key}`
    }
}

module.exports = {
    Stream
}
