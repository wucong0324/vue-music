<template>
    <transition name="drop">
        <div class="top-tip" v-show="showFlag" @click.stop="hide">
            <slot></slot>
        </div>
    </transition>
</template>
<script>
    export default{
        props: {
            delay: {
                type: Number,
                default: 2000
            }
        },
        data(){
            return {
                showFlag: false
            }
        },
        methods:{
            show(){
                this.showFlag = true;
                clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.hide();
                }, this.delay)
            },
            hide(){
                this.showFlag = false
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "topTip.scss";
</style>
