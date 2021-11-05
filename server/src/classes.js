class Heartbeat {
    constructor(expected, maximum, statusCallback) {
        this.expected = expected;
        this.maximum = maximum;
        this.statusCallback = statusCallback;
        this.status = "okay";

        this.tickInterval = setInterval(() => this.tick(), 1000);
        this.counter = 0;
    }

    toJSON() {
        return null;
    }

    tick() {
        this.counter++;
        if (this.counter >= this.maximum) {
            this.setStatus("maximum");
            this.kill();
        } else if (this.counter >= this.expected) {
            this.setStatus("expected");
        } else {
            this.setStatus("okay");
        }
    }
    setStatus(code) {
        if (this.status !== code) this.statusCallback(code);;
        this.status = code;
    }
    beat() {
        this.counter = 0;
    }
    kill() {
        clearInterval(this.tickInterval);
    }
}

class CowShoesLister {
    constructor(props) {
        this.servers = new Map();
    }

    toJSON() {
        let servers = Array.from(this.servers).map(([key, server]) => server)
        return {
            servers: servers
        }
    }

    serverUpdate(serverData, streams) {
        let serverKey = serverData.host;
        let server = this.servers.get(serverKey);
        if (!server) {
            server = this.createServer(serverData, streams);
        }
        server.updateStreams(streams);
    }

    createServer(serverData, streams) {
        let serverKey = serverData.host;
        console.log("creating a server", serverKey)
        this.servers.set(serverKey, new Server({
            key: serverKey,
            streams: streams,
            meta: serverData
        }))
        console.log(Array.from(this.servers));
        return this.servers.get(serverKey);
    }
}

class Server {
    constructor({key, streams, meta}) {
        this.key = key;
        this.meta = meta;
        this.streams = streams.map(s => new Stream({
            ...s,
            server: this
        }));
        this.heartbeat = new Heartbeat(5, 30, (status) => {
            console.warn(`agent [${this.key}] is now over [${status}]`)
        });
    }

    toJSON() {
        return {
            key: this.key,
            streams: this.streams.map(s => s.toJSON()),
            meta: this.meta
        }
    }

    updateStreams(streams) {
        this.heartbeat.beat();
        streams.forEach(stream => {
            let serverStream = this.streams.find(s => s.app === stream.app && s.key === stream.key)
            if (!serverStream) {
                // create one
                this.streams.push(new Stream({
                    ...stream,
                    server: this
                }))
                serverStream = this.streams[this.streams.length-1]
            } else {
                serverStream.update(stream);
            }
            // console.log(serverStream, stream)
        })
    }
}

class Stream {
    constructor({ host, app, key, isStreaming, server, ...data  }) {
        this.server = server;
        this.host = host;
        this.app = app;
        this.key = key;
        this.isStreaming = isStreaming;
        console.log("server object", server, this.server);
        this.heartbeat = new Heartbeat(2, 60, (status) => {
            console.log("status", this.key, status, this.server?.key)
        })

        this.liveData = {
            stats: data.stats,
            video: data.video,
            audio: data.audio,
            checkedAt: data.checkedAt,
            startedAt: data.startedAt
        };
    }

    toJSON() {
        return {
            app: this.app,
            key: this.key,
            isStreaming: this.isStreaming,
            liveData: this.liveData
        }
    }

    get rtmpURL() {
        return `rtmp://${this.host}/${this.app}/${this.key}`
    }

    update(data) {
        console.log(this.key, "update", data);
        this.liveData = {
            stats: data.stats,
            video: data.video,
            audio: data.audio,
            checkedAt: data.checkedAt,
            startedAt: data.startedAt
        }
    }
}

module.exports = {
    CowShoesLister,
    Stream
}
