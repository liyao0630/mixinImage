const utils = require('./lib/utils')
const xml = require('./lib/xml')
const Canvas = require('./lib/canvas')
const config = require('./config')
const path = require('path')

let filesPath = utils.getFiles(config.entry)
let pvrFile = utils.filterFile(filesPath, '.pvr')
let pvrTotal = pvrFile.length
let pvrCount = 0
let size = 1
let page = 1
let step = 0

mixinImagePvr(pvrFile.slice(0, size))

function mixinImagePvr(pvr) {
  pvr.forEach(async (files) => {
    let pathInfo = path.parse(files)
    let pvrPath = files
    let pngPath = files + config.pngSheet
    utils.pvrToPng(pvrPath, pngPath, 'dele.plist')

    // 解析xml
    let _prvPath = files.slice(0, files.lastIndexOf('.'))
    let xmlPath = _prvPath + '.xml'
    let xmlData = await xml.parseXmlSync(xmlPath)
    if (!xmlData) {
      throw new Error(xmlPath + '不存在！')
    }

    let canvasInfo = utils.computerCanvas(xmlData, files)
    console.log(canvasInfo);

    let canvas = new Canvas(canvasInfo.width, canvasInfo.height, pngPath)
    canvas.addLoadImage(pngPath)
    await canvas.drawImage(canvasInfo.maxX, canvasInfo.maxY)
    canvas.savePng(pngPath)

    let res = utils.pngToPvr(pvrPath, pngPath)
    utils.unlinkPng(pngPath)

    console.log(`共 ${pvrTotal} pvr文件,已处理${++pvrCount}, ${res.toString()}`)

    let mixinData = {
      '$': {
        n: pathInfo.name + '_' + utils.numBetween(10000, 1000) + '.png',
        x: utils.numBetween(canvasInfo.width),
        y: utils.numBetween(canvasInfo.height),
        w: utils.numBetween(10),
        h: utils.numBetween(10)
      }
    }
    xmlData.TextureAtlas.sprite.push(mixinData)
    let xmlOutputPath = pathInfo.dir + '/' + pathInfo.name + 'test' + '.xml'
    xml.writeXmlSync(xmlOutputPath, xmlData)

    if (++step === size) {
      step = 0
      let pvrs = pvrFile.slice(size * page, ++page * size)
      if (pvrs.length) {
        mixinImagePvr(pvrs)
      }
    }
  })
}