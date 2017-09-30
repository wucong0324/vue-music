/**
 * Created by thinkpad on 2017/8/16.
 */
import jsonp from '@/common/js/jsonp'
import {commonParams, options} from './config'

export function getHotKey() {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1,
        uin: 0,
        g_tk: 5381,
        format: 'jsonp',
    });
    return jsonp(url, data, options)
}

export function search(query, page, zhida, perpage) {
    const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
    const data = Object.assign({}, commonParams, {
        notice: 0,
        platform: 'h5',
        needNewCode: 1,
        uin: 0,
        g_tk: 759630315,
        format: 'jsonp',
        t: 0,
        flag: 1,
        ie: 'utf-8',
        sem: 1,
        aggr: 0,
        perpage,
        n: perpage,
        p: page,
        remoteplace: 'txt.mqq.all',
        w: query,
        zhidaqu: 1,
        catZhida: zhida ? 1 : 0,

    });
    return jsonp(url, data, options)
}