<template>
    <scroll class="listview"
            :data="data" ref="listView"
            :listenScroll="listenScroll"
            :probeType='probeType'
            @scroll='scroll'>
        <ul>
            <li class="list-group" v-for="(group,index) in data" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li class="list-group-item" v-for="(item,index) in group.items" @click="selectItem(item)">
                        <img class="avatar" v-lazy="item.avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut"
             @touchstart="onShortcutTouchStart"
             @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li class="item" v-for="(item,index) in shortcutList"
                    :data-index='index'
                    :class="{'current':currentIndex===index}">{{item}}
                </li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            <div class="fixed-title">{{fixedTitle}}</div>
        </div>
        <div class="loading-content" v-show="!data.length">
            <loading></loading>
        </div>
    </scroll>
</template>
<script>
    import {getData} from '@/common/js/dom'
    import scroll from '@/base/scroll/scroll'
    import loading from '@/base/loading/loading'

    const ANCHOR_HEIGHT = 18;
    const TITLE_HEIGHT = 30;
    export default{
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        data(){
            return {
                scrollY: -1,
                currentIndex: 0,
                diff: -1,
            }
        },
        created(){
            this.touch = {};
            this.listenScroll = true;
            this.listHeight = [];
            this.probeType = 3;
        },
        computed: {
            shortcutList(){
                return this.data.map((group) => {
                    return group.title.substr(0, 1);
                })
            },
            fixedTitle(){
                if(this.scrollY > 0){
                    return ''
                }
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
            }
        },
        methods: {
            selectItem(item){
                this.$emit('select', item);
            },
            onShortcutTouchStart(e){
                let anchorIndex = getData(e.target, 'index');
                let firstTouch = e.touches[0];
                this.touch.y1 = firstTouch.pageY;
                this.touch.anchorIndex = anchorIndex;
                this._scrollTo(anchorIndex);
            },
            onShortcutTouchMove(e){
                let firstTouch = e.touches[0];
                this.touch.y2 = firstTouch.pageY;
                let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
                let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
//                console.log(delta);
                this._scrollTo(anchorIndex);
            },
            refresh(){
                this.$refs.listView.refresh();
            },
            scroll(pos){
                this.scrollY = pos.y;
            },
            _scrollTo(index){
//                console.log(index);
                if(!index && index !==0){
                    return
                }
                if(index < 0){
                    index = 0
                }else if(index > this.listHeight.length-2){
                    index = this.listHeight.length-2
                }
                this.scrollY = -this.listHeight[index];
                this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
            },
            _calcHeight(){
                this.listHeight = [];
                const list = this.$refs.listGroup;
                let height = 0;
                this.listHeight.push(height);
                for (let i = 0; i < list.length; i++) {
                    let item = list[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            }
        },
        watch: {
            data(){
                setTimeout(() => {
                    this._calcHeight();
                }, 20)
            },
            scrollY(newY){
//                console.log(newY);
                const listHeight = this.listHeight;
                //  滚动到顶部，newY>0
                if(newY > 0){
                    this.currentIndex = 0;
                    return
                }
                //  中间部分滚动
                for (let i = 0; i < listHeight.length-1; i++) {
                    let height1 = listHeight[i];
                    let height2 = listHeight[i + 1];
                    if (-newY >= height1 && -newY < height2) {
                        this.currentIndex = i;
                        this.diff = height2 + newY;
                        return
                    }
                }
                //  滚动到最底部
                this.currentIndex = listHeight.length-2;
            },
            diff(newVal){
//                console.log(newVal);
                let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
                if(this.fixedTop === fixedTop){
                    return
                }
                this.fixedTop = fixedTop;
                this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            }
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
    @import "listview.scss";
</style>
