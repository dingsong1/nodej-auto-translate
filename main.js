const translate = require('./google-translate');
const path = require('path')
const fs = require('fs')
const data = require('./data.json');
const main = async () => {
  const fileName = 'data.json'
  const languages = ['en', 'es', 'zh-tw', 'id', 'th', 'vi']
  const list = Object.values(data)
  const names = Object.keys(data)
  let result = []
  for (let i = 0; i < languages.length; i++) {
    const currentLanguage = languages[i]
    try {
      let { text } = await translate({ to: currentLanguage, text: list.join('\n') })
      text = text.split(' ')
      let translateBefore = {}
      for (let j = 0; j < names.length; j++) {
        const name = names[j]
        translateBefore[name] = text[j]
      }
      result.push({ translate: translateBefore, name: currentLanguage })
    } catch (err) {
      console.log(err)
    }
    console.log('第' + i + '次', result)
  }

  for (let i = 0; i < result.length; i++) {
    const currentTranslators = result[i]
    const newFileName = path.join(__dirname, `/output/${currentTranslators.name}-${fileName}`)
    const translateContent = JSON.stringify(currentTranslators.translate)
    fs.writeFile(newFileName, translateContent, function (err) {
      if (err) return
      console.log('保持成功！', newFileName)
    })
  }

}
function sleep (delay) {
  for (var t = Date.now(); Date.now() - t <= delay;);
}
main()