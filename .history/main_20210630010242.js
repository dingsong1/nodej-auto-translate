const translate = require('./google-translate');

// translate({ text: '我是丁松啊', to: 'en' }).then(res => {
//   console.log(res.text);
//   //=> I speak English
//   //console.log(res.from.language.iso);
//   //=> nl
// }).catch(err => {
//   console.error(err);
// });
const data = require('./data.json');
// const fs = require('fs');
// const path = require('path');
const main = async () => {
  //const fileName = 'data.json'
  //const languages = ['en', 'es', 'zh-tw', 'id']
  const list = Object.values(data)
  let translateContent = list.join('\n')
  console.log(translateContent)
  //const { text } = await translate({ text: translateContent, to: 'en' })
  // let result = []
  for (let i = 0; i < languages.length; i++) {
    const currentLanguage = languages[i]
    let translateContent = list.join('\n')
    const { text } = await translate(translateContent, { to: currentLanguage })

    result.push({ translate: text, name: currentLanguage })
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
main()
// translate('我是丁松啊', { to: 'en' }).then(res => {
//   console.log(res.text);
//   //=> I speak English
//   console.log(res.from.language.iso);
//   //=> nl
// }).catch(err => {
//   console.error(err);
// });