'use strict';

const config = require('../config/environment');
// var rf=require("fs");  
// var data=rf.readFileSync("C:/Users/liuliang/Downloads/ed76f10532a14d12a8287e97dfbe2fbd.m3u8","utf-8");  
// console.log(data);  
// console.log("READ FILE SYNC END");
// m3u8ConverTs(data);
const m3u8ConverTs = exports.m3u8ConverTs = function (content) {
    content = content.substring(content.indexOf('#EXTINF:'), content.indexOf('#EXT-X-ENDLIST'));
    let dataArray = content.split('#EXTINF:');
    dataArray.shift();
    let files = [];
    for (let da of dataArray) {
        let url = da.split(',')[1].replace(/(^\s+)|(\s+$)/g, "");
        files.push(url);
    }
    return files;
}

// const data = [ 'D:/ts/150804/CG00001/CA00002_1508041340060000500_0_000001.ts',
//   'D:/ts/150804/CG00001/CA00002_1508041340110000500_0_000002.ts' ];
// coverUrl(data);
const coverUrl = exports.coverUrl = function (files) {
    let url = "";
    for (let fis of files) {
        const fp = files[fis];
        url += fp + "|";
    }

    url = url.substring(0, url.length - 1);
    return url;
}

// var rf=require("fs");  
// var data=rf.readFileSync("C:/Users/liuliang/Downloads/ed76f10532a14d12a8287e97dfbe2fbd.m3u8","utf-8");  
// console.log(data);  
// console.log("READ FILE SYNC END");
// m3u8ConverTs(data);
const tsUrlConverQiniuUrl = exports.tsUrlConverQiniuUrl = function (files) {
   let newFiles = new Array();
    for (let fis in files) {
        let url = fis;
        url = config.qiniu.domain+url.substring(url.indexOf("ts/"), url.length);
        newFiles.push(url);
    }
    return newFiles;
}