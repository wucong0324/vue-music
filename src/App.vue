<template>
    <div id="app">
        <v-header></v-header>
        <tab></tab>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <player></player>
    </div>
</template>

<script>
    import VHeader from '@/components/header/header'
    import tab from '@/components/tab/tab'
    import player from '@/components/player/player'
    export default {
        name: 'app',
        components: {
            VHeader,
            tab,
            player
        }
    }
</script>

<style>

</style>
