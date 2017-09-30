<template>
    <transition name="confirm-fade">
        <div class="confirm" v-show="showFlag" @click.stop>
            <div class="confirm-wrapper">
                <div class="confirm-content">
                    <p class="text">{{title}}</p>
                    <div class="operate">
                        <div @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
                        <div @click="confirm" class="operate-btn">{{confirmBtnText}}</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    export default{
        data(){
            return {
                showFlag: false
            }
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            confirmBtnText: {
                type: String,
                default: '确定'
            },
            cancelBtnText: {
                type: String,
                default: '取消'
            }
        },
        methods: {
            show(){
                this.showFlag = true
            },
            hide(){
                this.showFlag = false
            },
            cancel(){
                this.showFlag = false;
                this.$emit('cancel')
            },
            confirm(){
                this.showFlag = false;
                this.$emit('confirm')
            }
        }
    }
</script>
<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "confirm.scss";
</style>
