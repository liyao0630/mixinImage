const utils = require('./utils')
const xml = require('./xml')
const Canvas = require('./canvas')
const config = require('../config')
const path = require('path')

async function mixinPvr(pvr, callback) {
  let files = pvr.shift()
  if (!files) {
    return
  }
  
  let pathInfo = path.parse(files)
  let pngPath = pathInfo.dir + '/' + pathInfo.name + config.rename + '.png'
  utils.pvrToPng(files, pngPath, 'dele.plist')

  // 解析xml
  let xmlPath = pathInfo.dir + '/' + pathInfo.name + '.xml'
  let xmlData = await xml.parseXmlSync(xmlPath)
  if (!xmlData) {
    throw new Error(xmlPath + '不存在！')
  }

  let canvasInfo = utils.computerCanvas(xmlData, files)

  let mixinData = {
    '$': {
      n: pathInfo.name + '_' + utils.between(10000, 1000) + '.png',
      x: canvasInfo.maxX,
      y: canvasInfo.maxY,
      w: utils.between(10),
      h: utils.between(10)
    }
  }
  xmlData.TextureAtlas.sprite.push(mixinData)
  let xmlOutputPath = pathInfo.dir + '/' + pathInfo.name + config.rename + '.xml'
  xml.writeXmlSync(xmlOutputPath, xmlData)

  let canvas = new Canvas(canvasInfo.width, canvasInfo.height)
  canvas.addLoadImage(pngPath)
  await canvas.drawImage(canvasInfo.maxX, canvasInfo.maxY)
  canvas.savePng(pngPath)

  let res = utils.pngToPvr(files, pngPath)
  utils.unlinkPng(pngPath)

  // console.log(canvasInfo)
  callback && callback(res)

  await mixinPvr(pvr, callback)
}

module.exports = mixinPvr