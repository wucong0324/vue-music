<template>
    <div class="rank" ref="rank">
        <scroll class="topList" :data="topList" ref="topList">
            <ul>
                <li class="item" v-for="(item,index) in topList" @click="selectItem(item)">
                    <div class="icon">
                        <img v-lazy="item.picUrl" width="100%" height="100%">
                    </div>
                    <ul class="songList">
                        <li class="song" v-for="(song,index) in item.songList">
                            <span>{{index+1}}</span>
                            <span>{{song.singername}}-{{song.songname}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-container" v-show="!topList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
    import {getTopList} from '@/api/rank'
    import {ERR_OK} from '@/api/config'
    import scroll from '@/base/scroll/scroll'
    import loading from '@/base/loading/loading'
    import {playlistMixin} from '@/common/js/mixin'
    import {mapMutations} from 'vuex'
    export default{
        mixins: [playlistMixin],
        data(){
            return {
                topList: []
            }
        },
        created(){
            this._getTopList();
        },
        methods: {
            handlePlaylist(){
                const bottom = this.playlist.length ? '60px' : '';
                this.$refs.rank.style.bottom = bottom;
                this.$refs.topList.refresh();
            },
            selectItem(item){
                this.$router.push({path: `/rank/${item.id}`});
                this.setTopList(item)
            },
            _getTopList(){
                getTopList().then((res) => {
                    if (res.code === ERR_OK) {
//                        console.log(res.data.topList);
                        this.topList = res.data.topList
                    }
                })
            },
            ...mapMutations({
                'setTopList': 'SET_TOP_LIST'
            })
        },
        components: {
            scroll,
            loading
        }
    }
</script>

<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "rank.scss";
</style>