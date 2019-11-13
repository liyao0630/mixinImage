const { execSync, exec } = require('child_process')
const fs = require('fs')
const path = require('path')

exports.between = function (max, min) {
  let num = Math.random()
  if (min) {
    return Math.floor(num * (max - min)) + min
  } else {
    return Math.ceil(num * max)
  }
}

exports.pvrToPng = function (pvrPath, pngPath, plist) {
  execSync(`/usr/local/bin/TexturePacker ${pvrPath} --data ${plist} --texture-format png --format corona-imagesheet --shape-padding 0 --border-padding 0 --padding 0 --sheet ${pngPath} --opt RGBA8888`)
}

exports.pngToPvr = function (pvrPath, pngPath) {
  // mac 
  return execSync(`/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/usr/bin/texturetool -e PVRTC -o ${pvrPath} -f PVR ${pngPath}`)

  // TexturePacker 
  /* execSync(`/usr/local/bin/TexturePacker ${pngPath} --data ${getOutputPlist(Date.now() + '__.plist')} --texture-format pvr2 --format corona-imagesheet --shape-padding 0 --border-padding 0 --padding 0 --sheet ${getoutPath(pvrName)} --opt PVRTC2`) */
}

exports.unlinkPng = function unlinkPng(files) {
  fs.unlinkSync(files)
}

exports.computerCanvas = function (result) {
  let { width, height } = result.TextureAtlas.$
  let info = result.TextureAtlas.sprite
  let maxY = 0
  let maxX = 0
  info.forEach((val, index) => {
    let { x, y, w, h, n } = val.$
    x = parseInt(x)
    y = parseInt(y)
    if (maxX <= x) {
      maxX = x + parseInt(w)
    }
    if (maxY <= y) {
      maxY = y + parseInt(h)
    }
  })
  return {
    maxX,
    maxY,
    width: parseInt(width),
    height: parseInt(height)
  }
}

exports.getFiles = function (entryPath) {
  let jsonFiles = []
  function findFile(entryPath) {
    let files = fs.readdirSync(entryPath)
    files.forEach(function (item, index) {
      let fPath = path.join(entryPath, item)
      let stat = fs.statSync(fPath)
      if (stat.isDirectory() === true) {
        findFile(fPath)
      }
      if (stat.isFile() === true) {
        jsonFiles.push(fPath)
      }
    })
  }
  findFile(entryPath)
  return jsonFiles
}

exports.filterFile = function(origin, filter) {
  let result = []
  origin.forEach(val => {
    if (path.extname(val) === filter) {
      result.push(val)
    }
  })
  return result
}