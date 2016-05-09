'use strict';
const util = require('../../service/util');
const pd = require('parallel-download');
const rp = require('request-promise');
const config = require('../../config/environment');
const logConfig = require('../../config/log4js');
const log = logConfig.logger;
const errlog = logConfig.errLog;

class myvideo {
    constructor(mvs) {
        this.mvs = mvs;
        this.videoM3u8Contents = [];
        this.videoM3u8Urls = [];
        this.videoTsFiles = [];
        this.tsfiles = [];

    }

    splitVideo() {
        for (let mv of this.mvs) {
            if (!mv.sliceStartTime&&!mv.sliceEndTime) {
                let mvo = {
                    id: mv._id,
                    videos: mv.videos
                };
                if (mv.videos.length > 0) {
                    if (mv.videos[0].m3u8Content) {
                        this.videoM3u8Contents[this.videoM3u8Contents.length] = mvo;
                    } else {
                        this.videoM3u8Urls[this.videoM3u8Urls.length] = mvo;
                    }
                }
            }
        }
    }

    videoM3u8ContentsHandle() {
        if (this.videoM3u8Contents.length) {
            for (let mvo of this.videoM3u8Contents) {
                let vt = {
                    id: mvo.id,
                    tsFiles: []
                };
                for (let vd of mvo.videos) {
                    const m3u8Content = vd.m3u8Content;
                    const tsfiles = util.m3u8ConverTs(m3u8Content);
                    const first = tsfiles[0].toString();
                    const endts = tsfiles[tsfiles.length - 1].toString();
                    vt.tsFiles[vt.tsFiles.length] = first.substring(first.indexOf("/ts") + 1);
                    vt.tsFiles[vt.tsFiles.length] = endts.substring(endts.indexOf("/ts") + 1);
                    this.tsfiles.push(first.substring(first.indexOf("/ts") + 1));
                    this.tsfiles.push(endts.substring(endts.indexOf("/ts") + 1));
                }
                this.videoTsFiles[this.videoTsFiles.length] = vt;
            }
        }
    }

    *videoM3u8UrlsHandle() {
        if (this.videoM3u8Urls.length) {
            for (let mvo of this.videoM3u8Urls) {
                let vt = {
                    id: mvo.id,
                    tsFiles: []
                };
                let m3u8Urls = [];
                for (let vd of mvo.videos) {
                    const m3u8Url = vd.m3u8Url;
                    m3u8Urls[m3u8Urls.length] = m3u8Url;
                }
                log.info("开始下载m3u8Urls：",m3u8Urls);
                const respones = yield this.download(m3u8Urls);

                for (let rp of respones) {
                    log.info("m3u8 key:",rp.req.path," m3u8Content:",rp.content.toString());
                    const m3u8Content = rp.content.toString();
                    const tsfiles = util.m3u8ConverTs(m3u8Content);
                    const first = tsfiles[0].toString();
                    const endts = tsfiles[tsfiles.length - 1].toString();
                    vt.tsFiles[vt.tsFiles.length] = first.substring(first.indexOf("/ts") + 1);
                    vt.tsFiles[vt.tsFiles.length] = endts.substring(endts.indexOf("/ts") + 1);
                    this.tsfiles.push(first.substring(first.indexOf("/ts") + 1));
                    this.tsfiles.push(endts.substring(endts.indexOf("/ts") + 1));
                }
                this.videoTsFiles[this.videoTsFiles.length] = vt;
            }
        }
        log.info("myvideo数据预处理video id 数据：", this.videoTsFiles);
        log.info("myvideo数据预处理 访问tss数据：", this.tsfiles);
    }

    *getTsfileObject() {
        if (this.tsfiles.length) {
            let uri = "http://" + config.tss.host;
            if (config.tss.port) {
                uri = uri + ":" + config.tss.port + config.tss.getTsFilePath;
            } else {
                uri = uri + config.tss.getTsFilePath;
            }
            var options = {
                method: 'POST',
                uri: uri,
                body: {
                    keys: this.tsfiles
                },
                json: true // Automatically stringifies the body to JSON 
            };
            return rp(options)
        } else {
            return [];
        }
    }

    tsFileshandle(tsfiles) {
        let tsfileMap = new Map();
        for (let tsfile of tsfiles) {
            tsfileMap.set(tsfile.key, tsfile.tsFile);
        }
        let videos = [];
        for (let vt of this.videoTsFiles) {
            let video = {
                id: vt.id
            };
            let date = [];
            for (let tsfile of vt.tsFiles) {
                const tsFile = tsfileMap.get(tsfile);
                if (tsFile) {
                    date[date.length] = tsFile.startTime;
                    date[date.length] = tsFile.startTime + Number(tsFile.durationTime)*1000;
                }
            }
            log.info("video id为：",vt.id," 所有ts时间为：",date);
            if (date.length) {
                video.sliceStartTime = date.min();
                video.sliceEndTime = date.max();
            }
            videos[videos.length] = video;
        }
        return videos;
    }

    download(tsfiles) {
        return pd(tsfiles);
    }
    toString() {
        console.log(this.mvs.length);
    }
}

module.exports = myvideo;

