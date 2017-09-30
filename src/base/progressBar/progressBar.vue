<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper"
                 ref="progressBtn"
                 @touchstart.prevent="progressTouchStart"
                 @touchmove.prevent="progressTouchMove"
                 @touchend="progressTouchEnd"
            >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>
<script>
    import {prefixStyle} from '@/common/js/dom'

    const progressBtnWidth = 16;
    const transform = prefixStyle('transform');
    export default{
        props: {
            percent: {
                type: Number,
                default: 0
            }
        },
        data(){
            return {}
        },
        created(){
            this.touch = {};
        },
        methods: {
            progressTouchStart(e){
                this.touch.initiated = true;
                this.touch.startX = e.touches[0].pageX;
                this.touch.left = this.$refs.progress.clientWidth;
            },
            progressTouchMove(e){
                if (!this.touch.initiated) {
                    return
                }
                const deltaX = e.touches[0].pageX - this.touch.startX;
                const offsetWidth = Math.min(Math.max(0, this.touch.left + deltaX), this.$refs.progressBar.clientWidth - progressBtnWidth);
                this._offset(offsetWidth);
            },
            progressTouchEnd(){
                this.touch.initiated = false;
                this._triggerPercent();
            },
            progressClick(e){
//                console.log(this.$refs.progressBar.getBoundingClientRect(),e.pageX,e.offsetX);
                const rect = this.$refs.progressBar.getBoundingClientRect();
                const offsetWidth = e.pageX - rect.left;
                this._offset(offsetWidth);
                //  点击progressBtn e.offsetX没法获取
                //  this._offset(e.offsetX);
                this._triggerPercent();
            },
            _offset(offsetWidth){
                this.$refs.progress.style.width = `${offsetWidth}px`;
                this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            },
            _triggerPercent(){
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
                const percent = this.$refs.progress.clientWidth / barWidth;
                this.$emit('percentChange',percent)
            }
        },
        watch: {
            percent(newPercent){
                if (newPercent >= 0) {
                    const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
                    const offsetWidth = newPercent * barWidth;
                    this._offset(offsetWidth);
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "progressBar.scss";
</style>
