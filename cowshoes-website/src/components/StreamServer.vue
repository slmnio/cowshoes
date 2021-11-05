<template>
    <div class="stream-server">
        <div class="server-title server-part f-c">
            <div class="server-key fs-0">{{ server.key }}</div>
            <div class="spacer"></div>
            <div class="server-desc fs-0 t-r">
                <div class="server-desc-item" style="font-weight: bold;font-size: 1.2em">{{ server.meta.originalName }}</div>
                <div class="server-desc-item">hosted by {{ server.meta.hostedBy }}</div>
                <div class="server-desc-item" style="opacity: 0.7;font-size:0.7em;">{{ server.meta.location_3 }} {{ server.meta.location_2 }}</div>
            </div>
        </div>
        <div class="server-body server-part">
            <div class="server-list">
                <Stream :stream="stream" :server="server" v-for="stream in streams" v-bind:key="stream.key" />
            </div>
        </div>
    </div>
</template>

<script>
import Stream from "@/components/Stream";
export default {
    name: "StreamServer",
    props: ["server"],
    components: {Stream},
    computed: {
        streams() {
            if (!this.server?.streams?.length) return [];
            return [...this.server.streams].sort((a, b) => {
                if (a.isStreaming === b.isStreaming) return 0;
                if (a.isStreaming) return -1;
                return 1;
            })
        }
    }
}
</script>

<style scoped>
    .stream-server {
        background-color: var(--theme);
        color: var(--text-on-theme);
        margin: 1em 0;
    }
    .server-key {
        background-color: var(--text-on-theme);
        color: var(--theme);
        font-weight: bold;
        padding: .25em .5em;
        display: inline-block;
        font-size: 1.25em;
    }
    .server-part {
        padding: 1em;
    }
    .server-part + .server-part {
        padding-top: 0;
    }
</style>
