const fs = require('fs'),
  xml2js = require('xml2js'),
  path = require('path'),
  parser = new xml2js.Parser();

const { createCanvas, loadImage } = require('canvas')
var entry = __dirname + '/test2/'
var canvasWAdd = 10
var canvasHAdd = 6
// var 
// console.log(fs.readFileSync(entry + 'guangquanxiaoguo .png', 'base64'));

function xml(xmlFile) {
  let data = fs.readFileSync(entry + xmlFile);

  parser.parseString(data, function (err, result) {
    let spriteImg = result.TextureAtlas.$.imagePath
    let sprite = result.TextureAtlas.sprite
    let canvasInfo = computerCanvas(sprite, spriteImg)
    const canvas = createCanvas(canvasInfo.width, canvasInfo.height)
    const ctx = canvas.getContext('2d')
    var promiseImg = []
    sprite.forEach(val => {
      promiseImg.push(loadImage(entry + val.$.n))
    })
    var useGrange = 0
    Promise.all(promiseImg).then((imgs) => {
      imgs.forEach((val, i) => {
        console.log(useGrange);
        ctx.drawImage(val, 5, useGrange)
        useGrange += parseInt(sprite[i].$.h)
      })
      imgDataBase64ToFile(canvas.toDataURL(), canvasInfo.spriteName)
    })
  });
}

function createCanvasInfo({width, height}) {
  
}

function computerCanvas(sprite, spriteName) {
  let width = 0
  let height = 0
  sprite.forEach(val => {
    let { w, h } = val.$
    if (parseInt(w) > width) {
      width = parseInt(w) + canvasWAdd
    }
    height += parseInt(h)+canvasHAdd
  })
  return {
    width,
    height,
    spriteName
  }
}
xml('anxg.xml')

function imgDataBase64ToFile(imgData, imgName) {

  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = new Buffer(base64Data, 'base64'); // 解码图片

  fs.writeFile(entry + 'test' + imgName, dataBuffer, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("保存成功！");
    }
  })
}

function canvasFn(spriteImg, imgName, x, y, w, h) {
  const canvas = createCanvas(w, h)
  const ctx = canvas.getContext('2d')

  loadImage(entry + spriteImg).then((image) => {
    console.log(image);
    
    console.log('<img src="' + canvas.toDataURL() + '" />')
    imgDataBase64ToFile(canvas.toDataURL(), imgName)
  })
}


