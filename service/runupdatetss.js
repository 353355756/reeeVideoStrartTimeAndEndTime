'use strict';

const myvideoPO = require('../app/models/myvideo');
const reeemyvideoPO = require('../app/models/myvideoreee');
const logConfig = require('../config/log4js');
const log = logConfig.logger;
const errlog = logConfig.errLog;

const run = function* () {
    log.info("strart:", new Date());
    try {
        for (let i = 1; i <= 163000; i ++) {
            log.info("开始处理：", i, "的数据");
            const myvideo = yield myvideoPO.findByIndex(i);
            log.info("myvideo:",myvideo);
            if(myvideo&&myvideo.sliceStartTime){
                log.info("myvideo id: " ,myvideo._id," sliceStartTime:" , myvideo.sliceStartTime," ,sliceEndTime: ",myvideo.sliceEndTime );
                yield reeemyvideoPO.findByIdAndUpdate(myvideo._id,{ sliceStartTime: myvideo.sliceStartTime, sliceEndTime: myvideo.sliceEndTime });
            }
        }
    } catch (e) {
        errlog.error(e);
    }
    log.info("end:", new Date());
};

exports.run = run;
