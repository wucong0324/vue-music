<template>
    <transition name="slide">
        <musicList
                :songs="songs"
                :title="title"
                :bgImage="bgImage"></musicList>
    </transition>
</template>
<script>
    import musicList from '@/components/musicList/musicList'
    import {mapGetters} from 'vuex'
    import {getSongList} from '@/api/recommend'
    import {ERR_OK} from '@/api/config'
    import {createSong} from '@/common/js/song'
    export default{
        data(){
            return {
                song: []
            }
        },
        created(){
            this._getSongList();
        },
        computed: {
            ...mapGetters([
                'disc'
            ]),
            title(){
                return this.disc.dissname
            },
            bgImage(){
                return this.disc.imgurl
            }
        },
        methods: {
            _getSongList(){
                getSongList(this.disc.dissid).then((res) => {
                    console.log(res);
                    if (res.code === ERR_OK) {
                        this.songs = this._normalizeSongs(res.cdlist[0].songlist)
                    }
                })
            },
            _normalizeSongs(list){
                let ret = [];
                list.forEach((musicData) => {
                    if(musicData.songid && musicData.albummid){
                        ret.push(createSong(musicData))
                    }
                });
                return ret
            }
        },
        components: {
            musicList
        }
    }
</script>
<style scoped lang="scss">
    .slide-enter-active,.slide-leave-active{
        transition: all .3s;
    }
    .slide-enter,.slide-leave-to{
        transform: translate3d(100%,0,0);
    }
</style>
