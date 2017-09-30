/**
 * Created by thinkpad on 2017/8/1.
 */
import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export function getSingerList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';
    const data = Object.assign({}, commonParams, {
        platform: 'yqq',
        needNewCode: 0,
        uin: 0,
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        g_tk: 1164709313,
        loginUin: 0,
        hostUin: 0,
    });
    return jsonp(url, data, options)
}

export function getSingerDetail(singerId) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
    const data = Object.assign({}, commonParams, {
        g_tk: 847616338,
        loginUin: 0,
        hostUin: 0,
        notice: 0,
        platform: 'yqq',
        needNewCode: 0,
        singermid: singerId,
        order: 'listen',
        begin: 0,
        num: 100,
        songstatus: 1,
    });
    return jsonp(url, data, options)
}