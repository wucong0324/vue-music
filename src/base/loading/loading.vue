<template>
    <div class="loading">
        <img width="24" height="24" src="./loading.gif">
        <p>{{title}}</p>
    </div>
</template>

<script>
    export default{
        props: {
            title: {
                type: String,
                default: '正在载入……'
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../../common/style/base.scss";
    .loading{
        width: 100%;
        text-align: center;
        p{
            line-height: 20px;
            font-size: $font_small;
        }
    }
</style>
