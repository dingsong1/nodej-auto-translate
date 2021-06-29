const translate = require('./google-translate');

translate({ .to: 'en' }).then(res => {
  console.log(res.text);
  //=> I speak English
  //console.log(res.from.language.iso);
  //=> nl
}).catch(err => {
  console.error(err);
});