// send data to main server

const axios = require("axios");

async function send() {
    let monkyData = await axios.get("http://monky.slmn.io/api/rtmp-streams.php");
    if (monkyData.status === 200) {
        monkyData = monkyData.data;
    } else {
        return;
    }
    axios.post("http://localhost:8269/status", {
        host: "eu.cow.shoes",
        streams: monkyData.streams.map(streamData => {
            return {
                isStreaming: !!(streamData.video && streamData.audio),
                key: streamData.name,
                app: streamData.app,
                checkedAt: new Date(streamData.live_ms),
                internal: {
                    id: streamData.id,
                    vhost: streamData.vhost,
                },
                stats: {
                    total: {
                        sentBytes: streamData.send_bytes,
                        receivedBytes: streamData.recv_bytes,
                        totalFrames: streamData.frames
                    },
                    current: {
                        sentBytes: streamData.kbps.send_30s,
                        receivedBytes: streamData.kbps.recv_30s
                    }
                },
                startedAt: (streamData.frames ? new Date((new Date()) - (streamData.frames / 60) * 1000) : null),
                canReceive: streamData.publish?.active,
                ...(streamData.video ? ({
                    video: {
                        codec: streamData.video.codec.toLowerCase(),
                        width: streamData.video.width,
                        height: streamData.video.height
                    }
                }) : {}),
                ...(streamData.audio ? ({
                    audio: {
                        codec: streamData.audio.codec.toLowerCase(),
                        rate: streamData.audio.sample_rate,
                        channels: streamData.audio.channel
                    }
                }) : {})
            }
        })
    }).then(r => console.log("ok", r.status)).catch(e => console.error("err", e.status))

}

send();
setInterval(send, 2000);
