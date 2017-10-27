<template>
    <div class="recommend" ref="recommend">
        <scroll class="recommend-content" :data="discList" ref="scroll">
            <div>
                <div class="slider-wrapper" v-if="recommend.length">
                    <slider>
                        <div v-for="(item,index) in recommend">
                            <a :href="item.linkUrl">
                                <img class="needsclick" @load="imgLoad" :src="item.picUrl">
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="recommend-list">
                    <h1>热门歌单推荐</h1>
                    <ul>
                        <li class="item" v-for="(item,index) in discList" @click="selectItem(item)">
                            <div class="icon">
                                <img width="60" height="60" v-lazy="item.imgurl">
                            </div>
                            <div class="text">
                                <h2 class="name" v-html="item.creator.name"></h2>
                                <p class="desc" v-html="item.dissname"></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-content" v-show="!discList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
    import loading from '@/base/loading/loading'
    import slider from '@/base/slider/slider'
    import scroll from '@/base/scroll/scroll'
    import {getRecommend, getDiscList} from '@/api/recommend'
    import {ERR_OK} from '@/api/config'
    import {mapMutations} from 'vuex'
    import {playlistMixin} from '@/common/js/mixin'

    export default{
        mixins: [playlistMixin],
        data(){
            return {
                recommend: [],
                discList: [],
            }
        },
        created(){
            this._getRecommend();
            this._getDiscList();
        },
        methods: {
            imgLoad(){
                if (!this.checkLoad) {
                    this.$refs.scroll.refresh();
                    this.checkLoad = true
                }
            },
            handlePlaylist(playlist){
                const bottom = playlist.length > 0 ? '60px' : '';
                this.$refs.recommend.style.bottom = bottom;
                this.$refs.scroll.refresh();
            },
            selectItem(item){
//                console.log(item);
                this.$router.push({
                    path: `/recommend/${item.dissid}`
                });
                this.setDisc(item)
            },
            _getRecommend(){
                getRecommend().then((res) => {
                    if (res.code === ERR_OK) {
                        this.recommend = res.data.slider
                    }
                })
            },
            _getDiscList(){
                getDiscList().then((res) => {
                    if (res.code === ERR_OK) {
                        this.discList = res.data.list
                    }
                })
            },
            ...mapMutations({
                setDisc: 'SET_DISC'
            })
        },
        components: {
            slider,
            scroll,
            loading
        }
    }
</script>

<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "recommend.scss";
</style>