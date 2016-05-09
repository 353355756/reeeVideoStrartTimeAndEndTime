/**
 * Created by liulei_dev on 2016/2/26.
 */
const mongoose = require('../../service/mongoose');
const config = require('../../config/environment');
const co = require('co');
const thunkify = require('thunkify');
const logConfig = require('../../config/log4js');
const log = logConfig.logger;
const errlog = logConfig.errLog;
const num = config.row;//每次从数据库取多少条

const MyVideoSchema = mongoose.Schema({
    matchId: String,
    mgId: String,
    vgId: String,
    userId: String,
    videos: [{
        displayName: String,
        cameraCode: String,
        image: String,
        //    m3u8Id: String,
        m3u8Url: String,//七牛m3u8完整播放地址
        mp4Url: String,
        vid: String,
        m3u8Content: String,
        m3u8Key: String
    }],
    halfCourtId: String,
    stadiumId: String,//体育馆ID
    halfCourtName: String,//北航Reee1篮球场
    getCameraCode: String,//根据哪个角度切的
    videoTime: { type: Date, default: Date.now },//短视频的绝对时间开始时间
    startTime: Date,//整段视频开始时间
    endTime: Date,//整段视频结束时间
    delete: { type: Number, default: 0 },//能否删除   默认为0不能删除；1为能删除 没有关联关系的
    halfCourtShortName: String,//Reee1篮球场
    stadiumName: String,
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now },
    status: { type: Number, default: 1 },//0删除   1正常
    index: Number,
    sliceStartTime: Date,
    sliceEndTime: Date
});
const myVideoModel = global.reeemongoose.model('MyVideo', MyVideoSchema);
const find = thunkify(function () {
    myVideoModel.find.apply(myVideoModel, arguments)
});
module.exports = {
    findIndex: function (index) {
        return myVideoModel.find({ index: { $gt: index, $lte: index + num }, status: 1, sliceStartTime: null, sliceEndTime: null }).exec();
    },
    find: function (id) {
        return myVideoModel.findById(id).exec();
    },
    findByIdAndUpdate: function (id, update) {
        return myVideoModel.findByIdAndUpdate(id, update).exec();
    }
};
