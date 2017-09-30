import Vue from 'vue'
import Router from 'vue-router'
import recommend from '@/components/recommend/recommend'
import singer from '@/components/singer/singer'
import singerDetail from '@/components/singerDetail/singerDetail'
import rank from '@/components/rank/rank'
import search from '@/components/search/search'
import tree from '@/components/tree/tree'
import disc from '@/components/disc/disc'
import topList from '@/components/topList/topList'
import userCenter from '@/components/userCenter/userCenter'

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: __dirname,
    linkActiveClass: 'active',
    routes: [
        {path: '/', redirect: '/recommend'},
        {
            path: '/recommend',
            component: recommend,
            children: [
                {path: ':id',component: disc}
            ]
        },
        {
            path: '/singer',
            component: singer,
            children: [
                {path: ':id',component: singerDetail}
            ]
        },
        {
            path: '/rank',
            component: rank,
            children: [
                {path: ':id',component: topList}
            ]
        },
        {
            path: '/search',
            component: search,
            children: [
                {path: ':id',component: singerDetail}
            ]
        },
        {path: '/user', component: userCenter},
        {path: '/tree', component: tree},
    ]
})
