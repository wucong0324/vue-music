<template>
    <div class="header">
        <i class="icon"></i>
        <h1 class="text">Chicken Music</h1>
        <router-link to="/user" class="mine" tag="div">
            <i class="icon-mine"></i>
        </router-link>
    </div>
</template>
<script>
    export default{
        data(){
            return {}
        },
        components: {}
    }
</script>
<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "../../common/style/mixin.scss";
    @import "header.scss";
</style>
