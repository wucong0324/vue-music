/**
 * Created by thinkpad on 2017/8/12.
 */
import {commonParams, options} from './config'
import axios from 'axios'


export function getLyric(mid) {
    const url = '/api/lyric';
    const data = Object.assign({}, commonParams, {
        platform: 'yqq',
        hostUin: 0,
        pcachetime: +new Date(),
        needNewCode: 0,
        g_tk: 1164709313,
        songmid: mid
    });
    return axios.get(url, {
        params: data
    }).then(res => {
        return Promise.resolve(res.data)
    })
}