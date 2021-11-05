<template>
    <div class="stream f-c" v-bind:class="{ 'live': stream.isStreaming, 'offline': !stream.isStreaming }">
        <div class="left-code clickable" v-clipboard:copy="url" :title="`click to copy: ${url}`">
            {{ stream.app }}/{{ stream.key }}
        </div>
        <div class="spacer"></div>
        <div class="stats f-c fs-0">
            <div class="stat t-c" v-if="live" title="Stream resolution">
                {{ resolution }}
            </div>
            <div class="stat t-r" v-if="live" title="Average bitrate">
                {{ bitrate | bitrate }}
            </div>
            <div class="stat t-c" v-if="live" title="Total data streamed to server">
                {{ totalBits | bits }}
            </div>
            <div class="stat t-c" v-if="live" title="Estimated uptime">
                {{ uptime | duration }}
            </div>
            <div class="stat t-r" v-if="!live">
                Not live
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Stream",
    props: ["stream", "server"],
    computed: {
        url() {
            console.log(this.stream, this.server);
            return `rtmp://${this.server.key}/${this.stream.app}/${this.stream.key}`;
        },
        live() {
            return this.stream.isStreaming;
        },
        bitrate() {
            return this.stream?.liveData?.stats?.current?.receivedBytes || null
        },
        totalBits() {
            return this.stream?.liveData?.stats?.total?.receivedBytes || null
        },
        resolution() {
          let video = this.stream?.liveData?.video;
          if (!video) return null;

          if (video.height === 1088) video.height = 1080;
          return `${video.width}x${video.height}`;
        },
        startTime() {
            return this.stream.liveData.startedAt;
        },
        uptime() {
            if (!this.startTime) return null;
            console.log(this.startTime)
            let num = Math.floor((this.$root.now - new Date(this.startTime)) / 1000);
            return num;
        }
    },
    filters: {
        bitrate(num) {
            if (!num) return "-";
            num = parseInt(num);
            // if (num > 1e3) return (num / 1e3).toFixed(2) + " Mb/s"
            return num.toLocaleString() + " Kb/s"
        },
        bits(num) {
            if (!num) return "-";
            num = parseInt(num) / 1e3  * (1000/1024);
            if (num > 1e6) return (num / 1e6).toFixed(3) + " GB"
            if (num > 1e3) return (num / 1e3).toFixed(2) + " MB"
            return num.toLocaleString() + " KB"
        },
        duration(num) {
            if (!num) return "-";
            if (num < 60 * 60) {
                return [Math.floor(num / 60), num % 60].map(e => e.toString().padStart(2, "0")).join(':')
            }
            return [
                Math.floor(num / (60 * 60)),
                Math.floor((num / 60) % 60),
                num % 60
            ].map(e => e.toString().padStart(2, "0")).join(':');
        }
    }
}
</script>

<style scoped>
    .stat {
        margin: .5em 1.2em;
        /*min-width: 6em;*/
    }
    .stream.offline {
        opacity: 0.6;
    }
    .stream {
        min-height: 3em;
    }
    .left-code {
        padding: .5em;
        font-weight: bold;
        transition: all .1s ease;
        background-color: rgba(255,255,255,0.1)
    }
    .left-code:hover {
        background-color: var(--text-on-theme);
        color: var(--theme);
    }
</style>
