const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const { createCanvas, loadImage } = require('canvas')
var entry = __dirname + '/test2/'


function xml(xmlFile) {
  let data = fs.readFileSync(entry + xmlFile);

  parser.parseString(data, function (err, result) {
    let spriteImg = result.TextureAtlas.$.imagePath
    forEachXml(result.TextureAtlas.sprite, spriteImg)
  });
}

function forEachXml(sprite, spriteImg) {
  let { n, x, y, w, h } = sprite[0].$
  sprite.forEach(val => {
    let { n, x, y, w, h } = val.$
    canvasFn(spriteImg, n, -parseInt(x), -parseInt(y), parseInt(w), parseInt(h))
  })
}
xml('56200_1.xml')

function imgDataBase64ToFile(imgData, imgName) {

  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = new Buffer(base64Data, 'base64'); // 解码图片

  fs.writeFile(entry + imgName, dataBuffer, function (err) {
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
  console.log(entry + spriteImg)
  // return
  loadImage(entry + spriteImg).then((image) => {
    ctx.drawImage(image, x, y)
    imgDataBase64ToFile(canvas.toDataURL(), imgName)
  })
}


