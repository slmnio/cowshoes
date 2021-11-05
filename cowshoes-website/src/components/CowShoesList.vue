<template>
    <div class="cow-shoes-list">
        <StreamServer :server="server" v-for="server in servers" v-bind:key="server.key" />
    </div>
</template>

<script>
import StreamServer from "@/components/StreamServer";
export default {
    name: "CowShoesList",
    components: {StreamServer},
    data: () => ({
        servers: []
    }),
    sockets: {
        cow_shoes_update(data) {
            this.$root.now = new Date();
            if (data.servers) this.servers = data.servers;
        }
    }
}
</script>

<style scoped>

</style>
