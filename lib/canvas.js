const fs = require('fs');
const { createCanvas, loadImage } = require('canvas')
const config = require('../config')

const addImgPromise = loadImage(config.addImgPath)

module.exports = class Canvas {
  constructor(width, height, offsetW, offsetH) {
    this.width = width
    this.height = height
    this.offsetW = offsetW
    this.offsetH = offsetH
    this.promiseImg = [addImgPromise]
    this.createCanvas()
  }

  createCanvas() {
    this.canvas = createCanvas(this.width, this.height)
    this.ctx = this.canvas.getContext('2d')
  }

  async loadImage(pngPath) {
    return await loadImage(pngPath)
  }

  addLoadImage(pngPath) {
    this.promiseImg.push(loadImage(pngPath))
  }

  async loadImageSync() {
    return await Promise.all(this.promiseImg)
  }

  async drawImage() {
    let img = await this.loadImageSync()
    img.forEach((val, i) => {
      if (i === 0) {
        this.ctx.drawImage(val, this.offsetW, this.offsetH)
      } else {
        this.ctx.drawImage(val, 0, 0)
      }
    })
  }

  savePng(path) {
    let base64Data = this.canvas.toDataURL().replace(/^data:image\/\w+;base64,/, "")
    let dataBuffer = new Buffer(base64Data, 'base64') // 解码图片

    fs.writeFileSync(path, dataBuffer, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("保存成功！");
      }
    })
  }
}