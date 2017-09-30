/**
 * Created by thinkpad on 2017/7/19.
 */
import JSONP from 'jsonp'

export default function jsonp(url, data, option) {
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
    return new Promise((resolve, reject) => {
        JSONP(url, option, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}

function param(data) {
    let url = '';
    for (var key in data){
        let value = data[key] !== undefined ? data[key] : '';
        url += `&${key}=${encodeURIComponent(value)}`
    }
    return url ? url.substring(1) : ''
}