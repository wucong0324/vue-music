<template>
    <div class="search-box">
        <i class="icon-search"></i>
        <input v-model="query" type="text" class="box" :placeholder="placeholder" ref="query">
        <i @click="clear" v-show="query" class="icon-dismiss"></i>
    </div>
</template>
<script>
    import {debounce} from '@/common/js/util'
    export default{
        props: {
            placeholder: {
                type: String,
                default: '搜索歌曲、歌手'
            }
        },
        created(){
            this.$watch('query', debounce((newQuery) => {
                this.$emit('query', newQuery)
            }, 200))
        },
        data(){
            return {
                query: '',
            }
        },
        methods: {
            clear(){
                this.query = '';
            },
            setQuery(query){
                this.query = query
            },
            blur(){
                this.$refs.query.blur()
            }
        },
        components: {}
    }
</script>
<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "searchBox.scss";
</style>
