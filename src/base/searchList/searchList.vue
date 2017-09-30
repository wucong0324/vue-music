<template>
    <div class="search-list">
        <transition-group name="list" tag="ul">
            <li @click="selectItem(item)" class="search-item" v-for="(item, index) in searches" :key="item">
                <span class="text">{{item}}</span>
                <span class="icon" @click.stop="deleteOne(item)">
                    <i class="icon-delete"></i>
                </span>
            </li>
        </transition-group>
    </div>
</template>
<script>
    export default{
        props:{
            searches : {
                type: Array,
                default: []
            }
        },
        methods: {
            selectItem(item){
                this.$emit('select', item)
            },
            deleteOne(item){
                this.$emit('delete', item)
            }
        }
    }
</script>
<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "searchList.scss";
</style>
