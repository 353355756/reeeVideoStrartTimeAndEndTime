'use strict';

const myvideoPO = require('../app/models/myvideo');
const myvideoVO = require('../app/vo/myvideoVo');
const config = require('../config/environment');
const logConfig = require('../config/log4js');
const log = logConfig.logger;
const errlog = logConfig.errLog;

const run = function* () {
    log.info("strart:", new Date());
    try {
        for (let i = 0; i < 163000; i += config.row) {
            log.info("开始处理：", i, "到", i + config.row, "的数据");
            const myvideos = yield myvideoPO.findIndex(i);
            console.log(myvideos);
            if (myvideos.length) {
                const myvideovo = new myvideoVO(myvideos);
                const videos = myvideovo.splitVideo();
                myvideovo.videoM3u8ContentsHandle();
                yield myvideovo.videoM3u8UrlsHandle();
                const tsfiles = yield myvideovo.getTsfileObject();
                if (tsfiles.length) {
                    log.info("tss返回数据:", tsfiles);
                    const newVideos = myvideovo.tsFileshandle(tsfiles);
                    log.info("tss返回数据放入Map集合:", newVideos);
                    for (let video of newVideos) {
                        if (video.sliceStartTime && video.sliceEndTime) {
                            yield myvideoPO.findByIdAndUpdate(video.id, { sliceStartTime: video.sliceStartTime, sliceEndTime: video.sliceEndTime });
                        } else {
                            errlog.error("video Id 为", video.id, "，没有得到时间，错误数据为", video);
                        }
                    }
                } else {
                    errlog.error("tss返回数据错误:", tsfiles);
                }
                log.info(i, "到", i + config.row, "的数据已经处理完成");
            } else {
                log.info(i, "到", i + config.row, "的数据已经处理过");
            }
        }
    } catch (e) {
        errlog.error(e);
    }
    log.info("end:", new Date());
};

exports.run = run;
