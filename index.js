const utils = require('./lib/utils')
const config = require('./config')
const mixinPvr = require('./lib/mixinPvr')
const mixinPng = require('./lib/mixinPng')
const v8 = require('v8')

let filesPath = utils.getFiles(config.entry)

let pvrFile = utils.filterFile(filesPath, '.pvr')
let pvrTotal = pvrFile.length
let pvrCount = 0
function pvrCallback(res) {
  console.log(`共 ${pvrTotal} pvr文件,已处理${++pvrCount}\r\n`)
}
// mixinPvr(pvrFile, pvrCallback)

let pngFile = utils.filterFile(filesPath, '.png')
pngFile = pngFile.slice(5134, 8406)
let pngTotal = pngFile.length
let pngCount = 0
function pngCallback() {
  console.log(`共 ${pngTotal} png文件,已处理${++pngCount}\r\n`)
}

mixinPng(pngFile, pngCallback)



// /Users/ly/Documents/8.sdf/Res_11.12/images/ui/critRoulette/bg.png
// console.log('进程', process.memoryUsage());

// console.log('堆', v8.getHeapStatistics());

// console.log('内存', v8.getHeapSpaceStatistics());