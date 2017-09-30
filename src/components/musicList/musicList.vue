<template>
    <div class="music-list">
        <div class="back" @click="back()">
            <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="title"></h1>
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper" ref="playBtn">
                <div class="play" v-show="songs.length > 0" @click="random">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll :probeType="probeType"
                :listenScroll="listenScroll"
                :data="songs"
                @scroll="scroll"
                class="list" ref="list">
            <div class="song-list-wrapper">
                <songList
                        @select="selectItem"
                        :songs="songs"
                        :rank="rank"
                ></songList>
            </div>
            <div class="loading-container" v-show="!songs.length">
                <loading></loading>
            </div>
        </scroll>

    </div>
</template>
<script>
    import scroll from '@/base/scroll/scroll'
    import songList from '@/base/songList/songList'
    import loading from '@/base/loading/loading'
    import {prefixStyle} from '@/common/js/dom'
    import {mapActions} from 'vuex'
    import {playlistMixin} from '@/common/js/mixin'

    const RESERVED_HEIGHT = 40;
    const transform = prefixStyle('transform');
    const backdrop = prefixStyle('backdrop-filter');
    export default{
        mixins: [playlistMixin],
        props: {
            bgImage: {
                type: String,
                default: ''
            },
            songs: {
                type: Array,
                default: []
            },
            title: {
                type: String,
                default: ''
            },
            rank: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                scrollY: 0
            }
        },
        created(){
            this.probeType = 3;
            this.listenScroll = true
        },
        mounted(){
            this.imageHeight = this.$refs.bgImage.clientHeight;
            this.minTranslateY = -this.$refs.bgImage.clientHeight + RESERVED_HEIGHT;
            this.$refs.list.$el.style.top = `${this.imageHeight}px`
        },
        methods: {
            handlePlaylist(playlist){
                const bottom = playlist.length > 0 ? '60px' : '';
                this.$refs.list.$el.style.bottom = bottom;
                this.$refs.list.refresh();
            },
            back(){
                this.$router.back();
            },
            scroll(pos){
                this.scrollY = pos.y
            },
            selectItem(item, index){
                this.selectPlay({
                    list: this.songs,
                    index
                })
            },
            random(){
                this.randomPlay({
                    list: this.songs,
                })
            },
            ...mapActions([
                'selectPlay',
                'randomPlay'
            ])
        },
        computed: {
            bgStyle(){
                return `background-image:url(${this.bgImage})`
            }
        },
        watch: {
            scrollY(newY){
                let translateY = Math.max(this.minTranslateY, newY);
                let zIndex = 0;
                let scale = 1;
                let blur = 0;
                const percent = Math.abs(newY / this.imageHeight);
                if (newY > 0) {
                    scale = 1 + percent;
                    zIndex = 10;
                } else {
                    blur = Math.min(20 * percent, 20);
                }
                this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
                this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
                if (newY < this.minTranslateY) {
                    zIndex = 10;
                    this.$refs.bgImage.style.paddingTop = 0;
                    this.$refs.bgImage.style.height = '40px';
                    this.$refs.playBtn.style.display = 'none'
                } else {
                    this.$refs.bgImage.style.paddingTop = '70%';
                    this.$refs.bgImage.style.height = 0;
                    this.$refs.playBtn.style.display = ''
                }
                this.$refs.bgImage.style.zIndex = zIndex;
                this.$refs.bgImage.style.transform = `scale(${scale})`;
            }
        },
        components: {
            scroll,
            songList,
            loading
        }
    }
</script>
<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "musicList.scss";
</style>
