const translate = require('google-translate-api');

console.log('准备翻译')
translate('Ik spreek Engels', { to: 'en' }).then(res => {
  console.log(res.text);
  //=> I speak English
  console.log(res.from.language.iso);
  //=> nl
}).catch(err => {
  console.error(err);
});