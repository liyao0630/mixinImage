const utils = require('./lib/utils')
const config = require('./config')
const mixinPvr = require('./lib/mixinPvr')
const mixinPng = require('./lib/mixinPng')

let filesPath = utils.getFiles(config.entry)

let pvrFile = utils.filterFile(filesPath, '.pvr')
let pvrTotal = pvrFile.length
let pvrCount = 0
function pvrCallback(res) {
  console.log(`共 ${pvrTotal} pvr文件,已处理${++pvrCount}\r\n`)
}
mixinPvr(pvrFile, pvrCallback)

let pngFile = utils.filterFile(filesPath, '.png')
let pngTotal = pngFile.length
let pngCount = 0
function pngCallback() {
  console.log(`共 ${pngTotal} png文件,已处理${++pngCount}\r\n`)
}
mixinPng(pngFile, pngCallback)
