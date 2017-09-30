<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="icon" :class="iconMode" @click="changeMode"></i>
                        <span class="text" v-text="textMode"></span>
                        <span class="clear" @click="clear"><i class="icon-clear"></i></span>
                    </h1>
                </div>
                <scroll ref="listContent" class="list-content" :data="sequenceList" :refreshDelay="refreshDelay">
                    <transition-group tag="ul" name="list">
                        <li :key="item.id" ref="listItem" @click="selectItem(item,index)" class="item"
                            v-for="(item,index) in sequenceList">
                            <i class="current" :class="getCurrentIcon(item)"></i>
                            <span class="text">{{item.name}}</span>
                            <span @click.stop="toggleFavorite(item)" class="like"><i :class="getFavoriteIcon(item)"></i></span>
                            <span class="delete" @click.stop="deleteOne(item)"><i class="icon-delete"></i></span>
                        </li>
                    </transition-group>
                </scroll>
                <div class="list-operate">
                    <div class="add" @click="addSong">
                        <i class="icon-add"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div class="list-close" @click="hide">
                    <span>关闭</span>
                </div>
            </div>
            <confirm ref="confirm" @confirm="confirmClear" title="是否清空播放列表" confirmBtnText="清空"></confirm>
            <addSong ref="addSong"></addSong>
        </div>
    </transition>
</template>
<script>
    import {playMode} from '@/common/js/config'
    import {mapActions} from 'vuex'
    import scroll from '@/base/scroll/scroll'
    import confirm from '@/base/confirm/confirm'
    import addSong from '@/components/addSong/addSong'
    import {playerMixin} from '@/common/js/mixin'
    export default{
        mixins: [playerMixin],
        data(){
            return {
                showFlag: false,
                refreshDelay: 200
            }
        },
        methods: {
            show(){
                this.showFlag = true;
                setTimeout(() => {
                    this.$refs.listContent.refresh();
                    this.scrollToCurrent(this.currentSong);
                }, 20)
            },
            hide(){
                this.showFlag = false
            },
            getCurrentIcon(item){
                if (item.id === this.currentSong.id) {
                    return 'icon-play'
                }
                return ''
            },
            selectItem(item, index){
                if (this.mode === playMode.random) {
                    index = this.playlist.findIndex((song) => {
                        return song.id === item.id
                    })
                }
                this.setCurrentIndex(index);
                this.setPlayingState(true);

            },
            scrollToCurrent(current){
                const index = this.sequenceList.findIndex((song) => {
                    return current.id === song.id
                });
                this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
            },
            deleteOne(item){
                this.deleteSong(item);
                if (!this.playlist.length) {
                    this.hide();
                }
            },
            clear(){
                this.$refs.confirm.show();
            },
            confirmClear(){
                console.log('清空啦');
                this.deleteSongList();
                this.hide();

            },
            addSong(){
                this.$refs.addSong.show();
            },
            ...mapActions([
                'deleteSong',
                'deleteSongList'
            ])
        },
        computed: {
            textMode(){
                return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放'
            }
        },
        watch: {
            currentSong(newSong, oldSong){
                if (!this.showFlag || newSong.id === oldSong.id) {
                    return
                }
                this.scrollToCurrent(newSong);
            }
        },
        components: {
            scroll,
            confirm,
            addSong
        }
    }
</script>
<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "playlist.scss";
</style>
