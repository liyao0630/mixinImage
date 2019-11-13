const utils = require('./utils')
const xml = require('./xml')
const Canvas = require('./canvas')
const config = require('../config')

const imageinfo = require('imageinfo')
const path = require('path')
const fs = require('fs')

async function mixinPng(png, callback) {
  let files = png.shift()
  if (!files) {
    return
  }

  let pathInfo = path.parse(files)
  let mixinPngPath = pathInfo.dir + '/' + pathInfo.name + config.rename + '.png'
  let xmlPath = pathInfo.dir + '/' + pathInfo.name + '.xml'
  let info = imageinfo(fs.readFileSync(files))

  if (fs.existsSync(xmlPath)) { 
    let xmlData = await xml.parseXmlSync(xmlPath)
    let mixinData = {
      '$': {
        n: pathInfo.name + '_' + utils.between(10000, 1000) + '.png',
        x: info.width,
        y: info.height,
        w: utils.between(10),
        h: utils.between(10)
      }
    }
    xmlData.TextureAtlas.sprite.push(mixinData)
    let xmlOutputPath = pathInfo.dir + '/' + pathInfo.name + config.rename + '.xml'
    xml.writeXmlSync(xmlOutputPath, xmlData)
  }

  let widthC = info.width + config.addW
  let heightC = info.height + config.addH

  let canvas = new Canvas(widthC, heightC, info.width, info.height)
  canvas.addLoadImage(files)
  await canvas.drawImage()
  canvas.savePng(mixinPngPath)

  callback && callback()

  mixinPng(png, callback)
}

module.exports = mixinPng
