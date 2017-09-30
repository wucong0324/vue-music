<template>
    <div class="song-list">
        <ul>
            <li @click="selectItem(song, index)" v-for="(song,index) in songs" class="item">
                <div class="rank" v-show="rank">
                    <span :class="getRankClass(index)">{{getRankText(index)}}</span>
                </div>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
    export default{
        props: {
            songs: {
                type: Array,
                default: []
            },
            rank: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            getDesc(song){
                return `${song.singer}-${song.album}`
            },
            selectItem(item, index){
                this.$emit('select', item, index)
            },
            getRankClass(index){
                if(index <= 2){
                    return `icon icon${index}`
                }else{
                    return 'text'
                }
            },
            getRankText(index){
                if(index > 2){
                    return index + 1
                }
            }
        },
    }
</script>
<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "songList.scss";
</style>
