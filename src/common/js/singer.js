/**
 * Created by thinkpad on 2017/8/1.
 */
export default class Singer{
    constructor({id, name}){
        this.id = id,
        this.name = name,
        this.avatar = `https://y.gtimg.cn/music/photo_new/T001R800x800M000${id}.jpg?max_age=2592000`
    }
}