<template>
    <transition name="slide">
        <div class="user-center">
            <div class="back" @click="back">
                <i class="icon-back"></i>
            </div>
            <div class="switches-wrapper">
                <switches
                        :switches="switches"
                        @switch="switchItem"
                        :currentIndex="currentIndex">
                </switches>
            </div>
            <div class="play-btn" @click="random">
                <i class="icon-play"></i>
                <span class="text">随机播放全部</span>
            </div>
            <div class="list-wrapper" ref="listWrapper">
                <scroll class="list-scroll"
                        :data="favoriteList"
                        v-if="currentIndex === 0"
                        ref="favoriteList"
                >
                    <div class="list-inner">
                        <songList
                                :songs="favoriteList"
                                @select="selectSong"
                        ></songList>
                    </div>
                </scroll>
                <scroll class="list-scroll"
                        :data="playHistory"
                        v-if="currentIndex === 1"
                        ref="playHistory"
                >
                    <div class="list-inner">
                        <songList
                                :songs="playHistory"
                                @select="selectSong"
                        ></songList>
                    </div>
                </scroll>
            </div>
            <div class="no-result-wrapper" v-show="noResult()">
                <noResult :title="noResultDesc()"></noResult>
            </div>
        </div>
    </transition>
</template>
<script>
    import switches from '@/base/switches/switches'
    import scroll from '@/base/scroll/scroll'
    import songList from '@/base/songList/songList'
    import noResult from '@/base/noResult/noResult'
    import {mapGetters, mapActions} from 'vuex'
    import Song from '@/common/js/song'
    import {playlistMixin} from '@/common/js/mixin'
    export default{
        mixins: [playlistMixin],
        data(){
            return {
                switches: [
                    {name: '我喜欢的'},
                    {name: '最近播放'}
                ],
                currentIndex: 0
            }
        },
        computed: {
            ...mapGetters([
                'playHistory',
                'favoriteList'
            ])
        },
        methods: {
            handlePlaylist(playlist){
                const bottom = this.playlist.length > 0 ? '60px' : '';
                this.$refs.listWrapper.style.bottom = bottom;
                this.$refs.playHistory && this.$refs.playHistory.refresh();
                this.$refs.favoriteList && this.$refs.favoriteList.refresh();
            },
            back(){
                this.$router.back();
            },
            switchItem(index){
                this.currentIndex = index
            },
            selectSong(song){
                this.insertSong(new Song(song))
            },
            random(){
                let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
                if(list.length === 0){
                    return
                }
                list = list.map((song) => {
                    return new Song(song);
                });
                this.randomPlay({list});
            },
            noResult(){
                if(this.currentIndex === 0){
                    return !this.favoriteList.length
                }else{
                    return !this.playHistory.length
                }
            },
            noResultDesc(){
                if(this.currentIndex === 0){
                    return '暂无收藏歌曲'
                }else{
                    return '你还没有听过歌曲'
                }
            },
            ...mapActions([
                'insertSong',
                'randomPlay'
            ])
        },
        components: {
            switches,
            songList,
            scroll,
            noResult
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "userCenter.scss";
</style>
