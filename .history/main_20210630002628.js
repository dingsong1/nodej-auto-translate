const translate = require('google-translate-api');
const data = require('./data.json');

const main = async () => {
  const fileName = 'data.json'
  const languages = ['en', 'es', 'zh-tw', 'id']
  for (let i = 0; i < languages.length; i++) {
    const currentLanguage = languages[i]
    for (let j = 0; j <)
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