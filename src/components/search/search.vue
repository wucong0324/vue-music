<template>
    <div class="search">
        <div class="search-box-wrapper">
            <searchBox ref="searchBox" @query="onQueryChange"></searchBox>
        </div>
        <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
            <scroll class="shortcut" ref="shortcut" :data="shortcut" :refreshDelay="refreshDelay">
                <div>
                    <div class="hot-key">
                        <h1 class="title">热门搜索</h1>
                        <ul>
                            <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey">
                                <span>{{item.k}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="showConfirm">
                            <i class="icon-clear"></i>
                        </span>
                        </h1>
                        <searchList
                                :searches="searchHistory"
                                @select="addQuery"
                                @delete="deleteSearchHistory"
                        ></searchList>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchResult">
            <suggest
                    :query="query"
                    @listScroll="blurInput"
                    @select="saveSearch"
                    ref="suggest"
            ></suggest>
        </div>
        <confirm
                ref="confirm"
                title="是否清空所有搜索历史"
                confirmBtnText="清空"
                @cancel=""
                @confirm="clearSearchHistory"
        ></confirm>
        <router-view></router-view>
    </div>
</template>

<script>
    import searchBox from '@/base/searchBox/searchBox'
    import searchList from '@/base/searchList/searchList'
    import confirm from '@/base/confirm/confirm'
    import suggest from '@/components/suggest/suggest'
    import scroll from '@/base/scroll/scroll'
    import {getHotKey} from '@/api/search'
    import {ERR_OK} from '@/api/config'
    import {mapActions, mapGetters} from 'vuex'
    import {playlistMixin,searchMixin} from '@/common/js/mixin'
    export default{
        mixins: [playlistMixin,searchMixin],
        data(){
            return {
                hotKey: []
            }
        },
        created(){
            this._getHotKey();
        },
        methods: {
            handlePlaylist(){
                const bottom = this.playlist.length ? '60px' : '';
                this.$refs.shortcutWrapper.style.bottom = bottom;
                this.$refs.searchResult.style.bottom = bottom;
                this.$refs.shortcut.refresh();
                this.$refs.suggest.refresh();
            },
            showConfirm(){
                this.$refs.confirm.show();
            },
            _getHotKey(){
                getHotKey().then((res) => {
                    if (res.code === ERR_OK) {
                        this.hotKey = res.data.hotkey.slice(0, 10)
                    }
                })
            },
            ...mapActions([
                'clearSearchHistory'
            ])
        },
        computed: {
            shortcut(){
                return this.hotKey.concat(this.searchHistory)
            },
            ...mapGetters([
                'searchHistory'
            ])
        },
        watch: {
            query(newQuery){
                if(!newQuery){
                    setTimeout(() => {
                        this.$refs.shortcut.refresh();
                    }, 20)
                }
            }
        },
        components: {
            searchBox,
            searchList,
            confirm,
            scroll,
            suggest
        }
    }
</script>

<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "search.scss";
</style>