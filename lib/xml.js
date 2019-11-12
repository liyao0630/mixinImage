const xml2js = require('xml2js')
const fs = require('fs')
const parserXml = new xml2js.Parser()
const builderXml = new xml2js.Builder({ headless: true })

exports.parseXmlSync = async (filePath) => {
  if (fs.existsSync(filePath)) {
    let data = fs.readFileSync(filePath)
    return await parserXml.parseStringPromise(data)
  } else {
    return false
  }
}

exports.writeXmlSync = (outputPath, xmlData) => {
  fs.writeFileSync(outputPath, builderXml.buildObject(xmlData))
}