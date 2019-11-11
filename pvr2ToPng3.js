const { execSync, exec } = require('child_process');
var xml2js = require('xml2js');
var fs = require('fs');
var path = require('path');
var { createCanvas, loadImage } = require('canvas')
var parser = new xml2js.Parser()
var path = require('path')
var entry = __dirname + '/Res/'
var output = __dirname + '/Res/'
var outputPlist = __dirname + '/plist/'
var toPngSheet = '.png'
var addImgPath = 'add.png'
var addImgPromise = loadImage(addImgPath)
var addImgW = 54
var addImgH = 31
var canvasWAdd = 0
var canvasHAdd = 0

function getFiles(jsonPath) {
  let jsonFiles = [];
  let pvr = []
  function findJsonFile(_path) {
    let files = fs.readdirSync(path.resolve(_path));
    files.forEach(function (item, index) {
      let fPath = path.join(_path, item);
      let stat = fs.statSync(fPath);
      if (stat.isDirectory() === true) {
        findJsonFile(fPath);
      }
      if (stat.isFile() === true) {
        let extname = path.extname(fPath)
        if (extname === '.pvr') {
          pvr.push(fPath);
        } else {
          jsonFiles.push(fPath);
        }
      }
    });
  }
  findJsonFile(jsonPath);
  return {
    jsonFiles,
    pvr
  }
}
// prv转png
function prvToPng(prvPath, pngPath) {
  execSync(`/usr/local/bin/TexturePacker ${prvPath} --data ${getOutputPlist(Date.now() + '.plist')} --texture-format png --format corona-imagesheet --shape-padding 0 --border-padding 0 --padding 0 --sheet ${pngPath} --opt RGBA8888`)
}

let filesPath = getFiles(entry)
let notXml = []
let pvrTotal = filesPath.pvr.length
let pvrCount = 0
let size = 1
let page = 1
let single = 0
console.log(filesPath.pvr);
console.log(`共 ${pvrTotal} prv文件`);
// return 
splitPrvToPng(filesPath.pvr.slice(0, size))
function splitPrvToPng(pvr) {
  pvr.forEach(async (files, index) => {
    let prvPath = files
    let pngPath = files + toPngSheet
    prvToPng(prvPath, pngPath)
    // 解析xml
    let _prvPath = files.slice(0, files.lastIndexOf('.'))
    let xmlPath = _prvPath + '.xml'
    if (!fs.existsSync(xmlPath)) {
      notXml.push(xmlPath)
      return
    }
    let xmlData = await parseXmlSync(xmlPath)

    // 获取canvas信息并绘制canvas
    let canvasInfo = computerCanvas(xmlData, files)
    console.log(canvasInfo);
    const canvas = createCanvas(canvasInfo.width, canvasInfo.height)
    const ctx = canvas.getContext('2d')

    // 加载配置图片
    let promiseImg = [loadImage(pngPath)]
    promiseImg.push(addImgPromise)
    let imgAll = await Promise.all(promiseImg)

    // 绘制canvas
    imgAll.forEach((val, i) => {
      if (i === 0) {
        ctx.drawImage(val, 0, 0)
      } else {
        ctx.drawImage(val, canvasInfo.maxX, canvasInfo.maxY)
      }
    })

    // 产出新的png
    imgDataBase64ToFile(canvas.toDataURL(), pngPath)
    // console.log(`产出添加后 ${pngPath}`);
    // 新的png 转 pvr
    /* exec(`/usr/local/bin/TexturePacker ${pngPath} --data ${getOutputPlist(Date.now() + '__.plist')} --texture-format pvr2 --format corona-imagesheet --shape-padding 0 --border-padding 0 --padding 0 --sheet ${getoutPath(pvrName)} --opt PVRTC2`, function (err, stdout) {
      // unlinkPng(pngPath)
      console.log(`共 ${pvrTotal} 个prv文件,已处理 ${++pvrCount},剩余 ${pvrTotal - pvrCount}`);
      console.log(stdout);
    }) */
    
    var res = execSync(`/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/usr/bin/texturetool -e PVRTC -o ${prvPath} -f PVR ${pngPath}`)
    unlinkPng(pngPath)
    console.log(res.toString());
    console.log(`共 ${pvrTotal} prv文件,已处理 ${++pvrCount},剩余 ${pvrTotal - pvrCount}`);
    if (++single === size) {
      single = 0
      let start = size * page
      let end = ++page * size
      let pvrs = filesPath.pvr.slice(start, end)
      if (pvrs.length) {
        splitPrvToPng(pvrs)
      }
    }
  })
}

function getoutPath(_path) {
  return output + _path;
}
function getOutputPlist(_path) {
  return outputPlist + _path;
}

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

function computerCanvas(result) {
  let { width, height } = result.TextureAtlas.$
  let imgInfo = result.TextureAtlas.sprite
  let maxY = 0
  let maxX = 0
  imgInfo.forEach(val => {
    let { x, y, w, h, n } = val.$
    x = parseInt(x)
    y = parseInt(y)
    if (maxX <= x) {
      maxX = x + parseInt(w) + canvasWAdd
    }
    if (maxY <= y) {
      maxY = y + parseInt(h) + canvasHAdd
    }
  })
  return {
    maxX,
    maxY,
    width: parseInt(width),
    height: parseInt(height)
  }
}


function unlinkPng(files) {
  fs.unlinkSync(files)
}