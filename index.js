// const pd = require('parallel-download');

// const u = 'http://7xjetu.com3.z0.glb.qiniucdn.com/m3u8/160503/slice/CG00024/CA00055_160503190419/69a896e757a74db79b809d29103ea171_998c3a0c7edd4b55bd0717c7b7136aed.m3u8';
// const u1 = 'http://7xjetu.com3.z0.glb.qiniucdn.com/m3u8/160503/slice/CG00024/CA00055_160503190419/69a896e757a74db79b809d29103ea171_998c3a0c7edd4b55bd0717c7b7136aed.m3u8';

// pd([u,u1]).then(res => {
//     console.log(res[0].content.toString());
//     console.log(res[1].content.toString());
// });
'use strict';
const co = require('co');
const mongoose = require('mongoose');
//const Run = require('./service/run');
const RunUpdateTss = require('./service/runupdatetss');

Array.prototype.max = function () {   //最大值
    return Math.max.apply({}, this)
}

Array.prototype.min = function () {   //最小值
    return Math.min.apply({}, this)
}

//  co(Run.run).then(function () {
//     mongoose.disconnect(function (err) {
//         if (err) {
//             console.log(err);
//         }
//         console.log('执行完成');
//     });

// });


co(RunUpdateTss.run).then(function () {
    mongoose.disconnect(function (err) {
        if (err) {
            console.log(err);
        }
        console.log('执行完成');
    });
});


