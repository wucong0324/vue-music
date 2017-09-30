<template>
    <li>
        <span @click="toggle">
            <i v-if="isFolder" class="icon" :class="[open ? 'folder-open': 'folder']"></i>
            <i v-if="!isFolder" class="icon file-text"></i>
            {{ model.menuName }}
        </span>
        <ul v-show="open" v-if="folder">
            <treeList v-for="(item,index) in model.children" :model="item" :key="index"></treeList>
        </ul>
    </li>
</template>
<script>
    export default{
        name: 'treeList',
        props: ['model'],
        data(){
            return {
                open: false,
                isFolder: true
            }
        },
        methods: {
            toggle(){
                if(this.isFolder){
                    this.open = !this.open
                }
            }
        },
        computed: {
            folder(){
                return this.model.children && this.model.children.length
            }
        }
    }
</script>
<style scoped lang="scss">
    ul {
        list-style: none;
        margin-left: 20px;
    }
    i.icon {
        display: inline-block;
        width: 15px;
        height: 15px;
        background-repeat: no-repeat;
        vertical-align: middle;
    }
    .icon.folder {
        background: red;
        /*background-image: url(/src/assets/folder.png);*/
    }
    .icon.folder-open {
        background: green;
        /*background-image: url(/src/assets/folder-open.png);*/
    }
    .icon.file-text {
        background: yellow;
        /*background-image: url(/src/assets/file-text.png);*/
    }
    .tree-menu li {
        line-height: 1.5;
    }
</style>
