const translate = require('./google-translate');
const path = require('path')
const fs = require('fs')
const data = require('./data.json');
// const fs = require('fs');
// const path = require('path');
let { text } = await translate({ to: '', text: translateContent })
const main = async () => {
  const fileName = 'data.json'
  const languages = ['en', 'es', 'tw', 'id', 'th', 'vi']
  const list = Object.values(data)
  const names = Object.keys(data)
  let translateContent = list.join('\n')
  console.log(translateContent)
  //const { text } = await translate({ text: translateContent, to: 'en' })
  let result = []
  for (let i = 0; i < languages.length; i++) {
    const currentLanguage = languages[i]
    let translateContent = list.join('\n')
    let { text } = await translate({ to: currentLanguage, text: translateContent })
    text = text.split('\n')
    let translateBefore = {}
    for (let j = 0; j < names.length; j++) {
      const name = names[j]
      translateBefore[name] = text[j]
    }
    result.push({ translate: translateBefore, name: currentLanguage })
  }
  console.log(result)
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
main()
// translate('我是丁松啊', { to: 'en' }).then(res => {
//   console.log(res.text);
//   //=> I speak English
//   console.log(res.from.language.iso);
//   //=> nl
// }).catch(err => {
//   console.error(err);
// });