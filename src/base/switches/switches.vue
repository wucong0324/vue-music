<template>
    <ul class="switches">
        <li class="switch-item"
            v-for="(item,index) in switches"
            :class="{'active':currentIndex === index}"
            @click="switchItem(index)"
        >
            <span>{{item.name}}</span>
        </li>
    </ul>
</template>
<script>
    export default{
        props: {
            switches: {
                type: Array,
                default: []
            },
            currentIndex: {
                type: Number,
                default: 0
            }
        },
        methods: {
            switchItem(index){
                this.$emit('switch', index);
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "switches.scss";
</style>
