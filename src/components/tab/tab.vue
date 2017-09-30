<template>
    <div class="tab">
        <router-link tag="div" class="tabItem" to="/recommend"><span>推荐</span></router-link>
        <router-link tag="div" class="tabItem" to="/singer"><span>歌手</span></router-link>
        <router-link tag="div" class="tabItem" to="/rank"><span>排行</span></router-link>
        <router-link tag="div" class="tabItem" to="/search"><span>搜索</span></router-link>
    </div>
</template>

<style scoped lang="scss">
    @import "../../common/style/base.scss";
    @import "tab.scss";
</style>

