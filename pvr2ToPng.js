const { execSync } = require('child_process');
var xml2js = require('xml2js');
var fs = require('fs');
var path = require('path');
var { createCanvas, loadImage } = require('canvas')
var parser = new xml2js.Parser()
var path = require('path')
var entry = __dirname + '/'
var output = __dirname + '/dist/'
var toPngSheet = '_dele.png'
var canvasShell = '_dele_can.png'
var addImgPath = '/Users/ly/Downloads/good/add.png'
var addImgPromise = loadImage(addImgPath)
var addImgW = 54
var addImgH = 31
var canvasWAdd = 0
var canvasHAdd = 6

function getJsonFiles(jsonPath) {
  let jsonFiles = [];
  function findJsonFile(_path) {
    _path = entry + _path
    let files = fs.readdirSync(path.resolve(_path));
    files.forEach(function (item, index) {
      let fPath = path.join(_path, item);
      let stat = fs.statSync(fPath);
      if (stat.isDirectory() === true) {
        findJsonFile(fPath);
      }
      if (stat.isFile() === true) {
        jsonFiles.push(fPath);
      }
    });
  }
  findJsonFile(jsonPath);
  return jsonFiles
}
// prv转png
getJsonFiles("./test").forEach(async files => {
  let extname = path.extname(files)
  if (extname === '.pvr') {
    let pngPath = files + toPngSheet
    let pvrName = 'test_'+files.split('/')[files.split('/').length-1]
    let pvrPath = output + pvrName
    console.log(pvrPath);
    execSync(`/usr/local/bin/TexturePacker ${files} --data dele.plist --sheet ${pngPath} --opt RGBA8888`)
    let xmlPath = files.slice(0, files.lastIndexOf('.')) + '.xml'
    console.log(xmlPath);
    // 解析xml
    let xmlData = await parseXmlSync(xmlPath)
    let canvasInfo = computerCanvas(xmlData, files)
    console.log(canvasInfo);
    const canvas = createCanvas(canvasInfo.width, canvasInfo.height)
    const ctx = canvas.getContext('2d')

    let promiseImg = [loadImage(pngPath)]
    promiseImg.push(addImgPromise)
    let imgAll = await Promise.all(promiseImg)
    useGrange = canvasInfo.height - addImgH
    imgAll.forEach((val, i) => {
      if (i === 0) {
        ctx.drawImage(val, 0, 0)
      } else {
        ctx.drawImage(val, 0, useGrange)
      }
      // ctx.drawImage(val, 0, useGrange)
      // useGrange += parseInt(sprite[i].$.h)
    })
    console.log(pngPath)
    imgDataBase64ToFile(canvas.toDataURL(), pngPath)
    execSync(`/usr/local/bin/TexturePacker ${pngPath} --texture-format pvr2  --data dele_dist.plist --sheet ${pvrPath} --opt PVRTC2`)
    // 都做完 最后删除 png
    unlinkPng(pngPath)
  }
})
function imgDataBase64ToFile(imgData, imgName) {

  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  var dataBuffer = new Buffer(base64Data, 'base64'); // 解码图片

  fs.writeFileSync(imgName, dataBuffer, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("保存成功！");
    }
  })
}

async function parseXmlSync(filePath) {
  let data = fs.readFileSync(filePath);
  return await parser.parseStringPromise(data);
}

async function loadImgSync(filePath) {
  let data = fs.readFileSync(filePath);
  return await parser.parseStringPromise(data);
}

function computerCanvas(result) {
  let spriteInfo = result.TextureAtlas.$
  let width = parseInt(spriteInfo.width)
  let height = parseInt(spriteInfo.height) + addImgH + canvasHAdd
  if (width < addImgW + canvasWAdd) {
    width = addImgW + canvasWAdd
  }
  return {
    width,
    height
  }
}


function unlinkPng(files) {
  fs.unlinkSync(files)
}