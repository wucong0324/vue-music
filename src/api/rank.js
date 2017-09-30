/**
 * Created by thinkpad on 2017/8/15.
 */
import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export function getTopList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1,
        uin: 0,
        g_tk: 5381,
        format: 'jsonp',
    });
    return jsonp(url, data, options)
}

export function getMusicList(topid) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1,
        uin: 0,
        g_tk: 5381,
        format: 'jsonp',
        type: 'top',
        topid: topid,
        page: 'detail',
        tpl: 3
    });
    return jsonp(url, data, options)
}