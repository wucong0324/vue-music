<template>
    <scroll class="suggest"
            :data="result"
            :pullup="pullup"
            :beforeScroll="beforeScroll"
            @scrollToEnd="searchMore"
            @beforeScroll="listScroll"
            ref="suggest"
    >
        <ul class="suggest-list">
            <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result">
                <div class="icon">
                    <i :class="getIconClass(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div class="no-result-wrapper" v-show="!hasMore && !result.length">
            <noResult title="抱歉，暂无搜索结果"></noResult>
        </div>
    </scroll>
</template>
<script>
    import {search} from '@/api/search'
    import {ERR_OK} from '@/api/config'
    import scroll from '@/base/scroll/scroll'
    import loading from '@/base/loading/loading'
    import noResult from '@/base/noResult/noResult'
    import Singer from '@/common/js/singer'
    import {mapMutations, mapActions} from 'vuex'
    import {createSong} from '@/common/js/song'

    const TYPE_SINGER = 'singer';
    const perpage = 20;

    export default{
        props: {
            query: {
                type: String,
                default: ''
            },
            showSinger: {
                type: Boolean,
                default: true
            }
        },
        data(){
            return {
                page: 1,
                result: [],
                pullup: true,
                beforeScroll: true,
                hasMore: true
            }
        },
        methods: {
            search(){
                this.page = 1;
                this.hasMore = true;
                this.$refs.suggest.scrollTo(0, 0);
                search(this.query, this.page, this.showSinger, perpage).then((res) => {
                    if (res.code === ERR_OK) {
                        this.result = this._getResult(res.data);
                        this._checkMore(res.data);
                    }
                })
            },
            searchMore(){
                if (!this.hasMore) {
                    return
                }
                this.page++;
                search(this.query, this.page, this.showSinger, perpage).then((res) => {
                    if (res.code === ERR_OK) {
                        this.result = this.result.concat(this._getResult(res.data));
                        this._checkMore(res.data);
                    }
                })
            },
            getDisplayName(data){
                if (data.type === TYPE_SINGER) {
                    return data.singername
                } else {
                    return `${data.singer}-${data.name}`
                }
            },
            getIconClass(data){
                if (data.type === TYPE_SINGER) {
                    return 'icon-mine'
                } else {
                    return 'icon-music'
                }
            },
            selectItem(item){
                if (item.type === TYPE_SINGER) {
                    const singer = new Singer({
                        id: item.singermid,
                        name: item.singername
                    });
                    this.$router.push({
                        path: `/search/${singer.id}}`
                    });
                    this.setSinger(singer);
                } else {
                    this.insertSong(item);
                }
                this.$emit('select');
            },
            listScroll(){
                this.$emit('listScroll');
            },
            refresh(){
                this.$refs.suggest.refresh();
            },
            _checkMore(data){
                const song = data.song;
                if (!song.list.length || song.curnum + song.curpage * song.perpage >= song.totalnum || song.curnum == song.totalnum) {
                    this.hasMore = false
                }
            },
            _getResult(data){
                let ret = [];
                if (data.zhida && data.zhida.singerid) {
                    ret.push({...data.zhida, ...{type: TYPE_SINGER}});
                }
                if (data.song) {
//                    ret = ret.concat(data.song.list);
                    ret = ret.concat(this._normalizeSongs(data.song.list));
                }
                return ret;
            },
            _normalizeSongs(list){
                let ret = [];
                list.forEach((musicData) => {
                    if (musicData.songid && musicData.albummid) {
                        ret.push(createSong(musicData))
                    }
                });
                return ret
            },
            ...mapMutations({
                setSinger: 'SET_SINGER'
            }),
            ...mapActions([
                'insertSong'
            ])
        },
        watch: {
            query(){
                this.search()
            }
        },
        components: {
            scroll,
            loading,
            noResult
        }
    }
</script>
<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "suggest.scss";
</style>
