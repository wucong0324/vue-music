<template>
    <div class="player" v-show="playlist.length > 0">
        <transition
                name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
        >
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img width="100%" height="100%" :src="currentSong.image">
                </div>
                <div class="top">
                    <div class="back" @click="back">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div
                        class="middle"
                        @touchstart.prevent="middleTouchStart"
                        @touchmove.prevent="middleTouchMove"
                        @touchend="middleTouchEnd"
                >
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" ref="cdBox">
                                <img :class="cdClass" class="img" :src="currentSong.image">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{playingLyric}}</div>
                        </div>
                    </div>
                    <scroll
                            class="middle-r"
                            ref="lyricList"
                            :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p
                                        class="text"
                                        ref="lyricLine"
                                        v-for="(item,index) in currentLyric.lines"
                                        :class="{'current' : currentLineNum === index}">{{item.txt}}</p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
                        <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progressBar
                                    :percent="percent"
                                    @percentChange="onProgressBarChange"
                            ></progressBar>
                        </div>
                        <span class="time time-r">{{format(this.currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <i :class="iconMode"></i>
                        </div>
                        <div class="icon i-left" :class="disableClass">
                            <i @click="prev" class="icon-prev"></i>
                        </div>
                        <div class="icon i-center" :class="disableClass">
                            <i @click="togglePlaying" :class="playIcon"></i>
                        </div>
                        <div class="icon i-right" :class="disableClass">
                            <i @click="next" class="icon-next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon" :class="getFavoriteIcon(currentSong)"
                               @click="toggleFavorite(currentSong)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" @click="open" v-show="!fullScreen">
                <div class="icon">
                    <div ref="miniCdBox">
                        <img :class="cdClass" width="40" height="40" :src="currentSong.image">
                    </div>
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <progressCircle :radius="radius" :percent="percent">
                        <i class="icon-mini" @click.stop="togglePlaying" :class="miniIcon"></i>
                    </progressCircle>

                </div>
                <div class="control" @click.stop="showPlaylist">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <playlist ref="playlist"></playlist>
        <audio
                ref="audio"
                :src="currentSong.url"
                @canplay="ready"
                @error="error"
                @timeupdate="updateTime"
                @ended="end"
        ></audio>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import animations from 'create-keyframe-animation'
    import {playMode} from '@/common/js/config'
    import {prefixStyle} from '@/common/js/dom'
    import progressBar from '@/base/progressBar/progressBar'
    import progressCircle from '@/base/progressCircle/progressCircle'
    import lyricParser from 'lyric-parser'
    import scroll from '@/base/scroll/scroll'
    import playlist from '@/components/playlist/playlist'
    import {playerMixin} from '@/common/js/mixin'

    const transform = prefixStyle('transform');
    const transitionDuration = prefixStyle('transitionDuration');
    export default{
        mixins: [playerMixin],
        data(){
            return {
                songReady: false,
                currentTime: 0,
                radius: 32,
                currentLyric: null,
                currentLineNum: 0,
                currentShow: 'cd',
                playingLyric: ''
            }
        },
        created(){
            this.touch = {}
        },
        methods: {
            showPlaylist(){
                this.$refs.playlist.show();
            },
            back(){
                this.setFullScreen(false);
            },
            open(){
                this.setFullScreen(true);
            },
            enter(el, done){
                const {x, y, scale} = this._getPostAndScale();
                let animation = {
                    0: {
                        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                    },
                    60: {
                        transform: `translate3d(0,0,0) scale(1.1)`
                    },
                    100: {
                        transform: `translate3d(0,0,0) scale(1)`
                    }
                };
                animations.registerAnimation({
                    name: 'move',
                    animation,
                    presets: {
                        duration: 400,
                        easing: 'linear',
                    }
                });
                animations.runAnimation(this.$refs.cdWrapper, 'move', done)
            },
            afterEnter(){
                animations.unregisterAnimation('move');
                this.$refs.cdWrapper.style.animation = '';
            },
            leave(el, done){
                this.$refs.cdWrapper.style.transition = 'all .4s';
                const {x, y, scale} = this._getPostAndScale();
                this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
                this.$refs.cdWrapper.addEventListener('transitionend', done);

            },
            afterLeave(){
                this.$refs.cdWrapper.style.transition = '';
                this.$refs.cdWrapper.style[transform] = '';
            },
            togglePlaying(){
                /*const cdBox = this.$refs.cdBox;
                 const miniCdBox = this.$refs.miniCdBox;*/
                if (!this.songReady) {
                    return
                }
                this.setPlayingState(!this.playing);
                if (this.currentLyric) {
                    this.currentLyric.togglePlay();
                }
                /*if(!this.playing){
                 let imgTransform = getComputedStyle(cdBox.querySelector('img'))[transform];
                 let cdBoxTransform = getComputedStyle(cdBox)[transform];
                 let miniImgTransform = getComputedStyle(miniCdBox.querySelector('img'))[transform];
                 let miniCdTransform = getComputedStyle(miniCdBox)[transform];
                 cdBox.style[transform] = cdBoxTransform === 'none' ? imgTransform : imgTransform.concat(' ', cdBoxTransform);
                 miniCdBox.style[transform] = cdBoxTransform === 'none' ? imgTransform : imgTransform.concat(' ', cdBoxTransform);
                 cdBox.querySelector('img').classList.remove('play');
                 miniCdBox.querySelector('img').classList.remove('play');
                 console.log(miniImgTransform, miniCdTransform);
                 }else{
                 console.log(cdBox, miniCdBox);
                 cdBox.querySelector('img').classList.add('play');
                 miniCdBox.querySelector('img').classList.add('play');
                 }*/
            },
            end(){
                if (this.mode === playMode.loop) {
                    this.loop();
                } else {
                    this.next();
                }

            },
            loop(){
                this.$refs.audio.currentTime = 0;
                this.$refs.audio.play();
                if (this.currentLyric) {
                    this.currentLyric.seek();
                }
            },
            prev(){
                if (!this.songReady) {
                    return
                }
                if (this.playlist.length === 1) {
                    this.loop();
                    return
                } else {
                    let index = this.currentIndex - 1;
                    if (index === -1) {
                        index = this.playlist.length - 1;
                    }
                    this.setCurrentIndex(index);
                    if (!this.playing) {
                        this.togglePlaying()
                    }
                }
                this.songReady = false;
            },
            next(){
                if (!this.songReady) {
                    return
                }
                if (this.playlist.length === 1) {
                    this.loop();
                    return
                } else {
                    let index = this.currentIndex + 1;
                    if (index === this.playlist.length) {
                        index = 0;
                    }
                    this.setCurrentIndex(index);
                    if (!this.playing) {
                        this.togglePlaying()
                    }
                }
                this.songReady = false;
            },
            ready(){
                this.songReady = true;
                this.savePlayHistory(this.currentSong)
            },
            error(){
                this.songReady = true;
            },
            updateTime(e){
                this.currentTime = e.target.currentTime;
            },
            onProgressBarChange(percent){
                const currentTime = this.currentSong.duration * percent
                this.$refs.audio.currentTime = currentTime;
                if (!this.playing) {
                    this.togglePlaying();
                }
                if (this.currentLyric) {
                    this.currentLyric.seek(currentTime * 1000);
                }
            },
            format(interval){
                interval = interval | 0;
                const minute = interval / 60 | 0;
                const sencond = this._pad(interval % 60);
                return `${minute}:${sencond}`
            },
            getLyric(){
                this.currentSong.getLyric().then((lyric) => {
                    if(this.currentSong.lyric !== lyric){
                        return
                    }
                    this.currentLyric = new lyricParser(lyric, this.handleLyric);
                    if (this.playing) {
                        this.currentLyric.play();
                    }
                }).catch(() => {
                    this.currentLyric = null;
                    this.playingLyric = '';
                    this.currentLineNum = 0;
                })
            },
            handleLyric({lineNum, txt}){
                this.currentLineNum = lineNum;
                if (lineNum > 5) {
                    let lineEl = this.$refs.lyricLine[lineNum - 5];
                    this.$refs.lyricList.scrollToElement(lineEl, 1000);
                } else {
                    this.$refs.lyricList.scrollTo(0, 0, 1000);
                }
                this.playingLyric = txt;
            },
            middleTouchStart(e){
                this.touch.initiated = true;
                const touch = e.touches[0];
                this.touch.startX = touch.pageX;
                this.touch.startY = touch.pageY;
            },
            middleTouchMove(e){
                if (!this.touch) {
                    return
                }
                const touch = e.touches[0];
                const deltaX = touch.pageX - this.touch.startX;
                const deltaY = touch.pageY - this.touch.startY;
                if (Math.abs(deltaY) > Math.abs(deltaX)) {
                    return
                }
                const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
                const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
                this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
                this.$refs.lyricList.$el.style[transitionDuration] = 0;
                this.$refs.middleL.style.opacity = 1 - this.touch.percent;
                this.$refs.middleL.style[transitionDuration] = 0;
            },
            middleTouchEnd(){
                let offsetWidth;
                let opacity;
                if (this.currentShow === 'cd') {
                    if (this.touch.percent > 0.1) {
                        offsetWidth = -window.innerWidth;
                        opacity = 0;
                        this.currentShow = 'lyric';
                    } else {
                        offsetWidth = 0;
                        opacity = 1;
                    }
                } else {
                    if (this.touch.percent < 0.9) {
                        offsetWidth = 0;
                        opacity = 1;
                        this.currentShow = 'cd';
                    } else {
                        offsetWidth = -window.innerWidth;
                        opacity = 0;
                    }
                }
                const time = 300;
                this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
                this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
                this.$refs.middleL.style.opacity = opacity;
                this.$refs.middleL.style[transitionDuration] = `${time}ms`;
            },
            _pad(num, n = 2){
                let len = num.toString().length;
                while (len < n) {
                    num = '0' + num;
                    len++;
                }
                return num
            },
            _getPostAndScale(){
                const targetWidth = 40;
                const paddingLeft = 40;
                const paddingBottom = 30;
                const paddingTop = 80;
                const width = window.innerWidth * .8;
                const scale = targetWidth / width;
                const x = -(window.innerWidth / 2 - paddingLeft);
                const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
                return {
                    x,
                    y,
                    scale
                }
            },
            ...mapMutations({
                setFullScreen: 'SET_FULL_SCREEN',
            }),
            ...mapActions([
                'savePlayHistory'
            ])
        },
        computed: {
            playIcon(){
                return this.playing ? 'icon-pause' : 'icon-play'
            },
            miniIcon(){
                return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
            },
            cdClass(){
                return this.playing ? 'play' : 'play pause'
            },
            disableClass(){
                return this.songReady ? '' : 'disable'
            },
            percent(){
                return this.currentTime / this.currentSong.duration
            },
            ...mapGetters([
                'fullScreen',
                'playing',
                'currentIndex',
            ])
        },
        watch: {
            currentSong(newSong, oldSong){
                if (!newSong.id) {
                    return
                }
                if (newSong.id === oldSong.id) {
                    return
                }
                if (this.currentLyric) {
                    this.currentLyric.stop();
                    this.currentTime = 0;
                    this.playingLyric = '';
                    this.currentLineNum = 0
                }
                /*this.$nextTick(() => {
                    this.$refs.audio.play();
                    this.getLyric();
                });*/
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.$refs.audio.play();
                    this.getLyric();
                }, 1000)
            },
            playing(newPlaying){
                const audio = this.$refs.audio;
                this.$nextTick(() => {
                    newPlaying ? audio.play() : audio.pause()
                });
            }
        },
        components: {
            progressBar,
            progressCircle,
            scroll,
            playlist
        }
    }
</script>
<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "player.scss";
</style>
