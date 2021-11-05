<template>
    <div id="app">
        <div id="cow">🐄</div>
        <CowShoesList/>
    </div>
</template>

<script>

import CowShoesList from "@/components/CowShoesList";

export default {
    name: 'App',
    components: {
        CowShoesList
    }
}
</script>

<style>
@import "~@/assets/app.css";
#cow {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    font-size: 25vmin;
    line-height: 1;
    opacity: 0.2;
    z-index: -1;
}

body {
    background-color: #040e10;
    color: white;
    font-family: sans-serif;
}
#app {
    max-width: 800px;
    margin: 0 auto;
}
</style>
