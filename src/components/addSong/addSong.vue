<template>
    <transition name="slide">
        <div class="add-song" v-show="showFlag" @click.stop>
            <div class="header">
                <h1 class="title">添加歌曲到列表</h1>
                <div class="close" @click="hide">
                    <i class="icon-close"></i>
                </div>
            </div>
            <div class="search-box-wrapper">
                <searchBox ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></searchBox>
            </div>
            <div class="shortcut" v-show="!query">
                <switches
                        :switches="switches"
                        :currentIndex="currentIndex"
                        @switch="switchItem"
                ></switches>
                <div class="list-wrapper">
                    <scroll ref="songList" class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
                        <div class="list-inner">
                            <songList :songs="playHistory" @select="selectSong"></songList>
                        </div>
                    </scroll>
                    <scroll class="list-scroll"
                            ref="searchList"
                            :data="searchHistory"
                            :refreshDelay="refreshDelay"
                            v-if="currentIndex === 1"
                    >
                        <div class="list-inner">
                            <searchList
                                    :searches="searchHistory"
                                    @select="addQuery"
                                    @delete="deleteSearchHistory"
                            ></searchList>
                        </div>
                    </scroll>
                </div>
            </div>
            <div class="search-result" v-show="query">
                <suggest
                        :query="query"
                        :showSinger="showSinger"
                        @listScroll="blurInput"
                        @select="selectSuggest"
                ></suggest>
            </div>
            <topTip ref="topTip">
                <div class="tip-title">
                    <i class="icon-ok"></i>
                    <span class="text">一首歌曲已经添加到播放队列</span>
                </div>
            </topTip>
        </div>
    </transition>
</template>
<script>
    import searchBox from '@/base/searchBox/searchBox'
    import searchList from '@/base/searchList/searchList'
    import songList from '@/base/songList/songList'
    import scroll from '@/base/scroll/scroll'
    import topTip from '@/base/topTip/topTip'
    import suggest from '@/components/suggest/suggest'
    import switches from '@/base/switches/switches'
    import {searchMixin} from '@/common/js/mixin'
    import {mapGetters, mapActions} from 'vuex'
    import Song from '@/common/js/song'
    export default{
        mixins: [searchMixin],
        data(){
            return {
                showFlag: false,
                showSinger: false,
                switches: [
                    {name: '最近播放'},
                    {name: '历史搜索'}
                ],
                currentIndex: 0
            }
        },
        methods: {
            show(){
                this.showFlag = true;
                setTimeout(() => {
                    if(this.currentIndex === 0){
                        this.$refs.songList.refresh();
                    }else{
                        this.$refs.searchList.refresh();
                    }
                }, 20)
            },
            hide(){
                this.showFlag = false
            },
            switchItem(index){
                this.currentIndex = index;
            },
            selectSuggest(){
                this.saveSearch();
                this.showTip();
            },
            selectSong(song, index){
                if (index !== 0) {
                    this.insertSong(new Song(song));
                    this.showTip();
                }
            },
            showTip(){
                this.$refs.topTip.show();
            },
            ...mapActions([
                'insertSong'
            ])
        },
        components: {
            searchBox,
            suggest,
            switches,
            searchList,
            songList,
            topTip,
            scroll
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "addSong.scss";
</style>
