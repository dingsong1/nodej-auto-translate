const translate = require('google-translate-api');

translate('我是丁松啊', { to: 'en' }).then(res => {
  console.log(res.text);
  //=> I speak English
  //console.log(res.from.language.iso);
  //=> nl
}).catch(err => {
  console.error(err);
});