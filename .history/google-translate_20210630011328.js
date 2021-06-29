const superagent = require('superagent')
const qs = require('qs')
const he = require('he')
const userAgents = require('./userAgent')
const GOOGLE_TRANSLATE_URL = 'https://translate.google.cn/translate_a/single'

//构造请求头-ip
function returnIp () {
  return (
    Math.floor(Math.random() * (10 - 255) + 255) +
    "." +
    Math.floor(Math.random() * (10 - 255) + 255) +
    "." +
    Math.floor(Math.random() * (10 - 255) + 255) +
    "." +
    Math.floor(Math.random() * (10 - 255) + 255)
  );
}

//构造请求头-浏览器
function randomHead () {
  return userAgents[
    Math.floor(Math.random() * (0 - userAgents.length) + userAgents.length)
  ];
}

const genToken = (a) => {
  const d = 406644
  const b1 = 3293161072
  const e = '.'
  const one = '+-a^+6'
  const actual = '+-3^+b+-f'
  let s = []

  for (let i = 0, f = 0; f < a.length; f++) {
    let tmp = a.charCodeAt(f)

    if (tmp < 128) {
      s[i++] = tmp
    } else {
      if (tmp < 2048) {
        s[i++] = (tmp >> 6) | 192
      } else {
        // eslint-disable-next-line
        if (
          55296 == (tmp & 64512) &&
          f + 1 < a.length &&
          56320 == (a.charCodeAt(f + 1) & 64512)
        ) {
          tmp = 65536 + ((tmp & 1023) << 10) + (a.charCodeAt(++f) & 1023)
          s[i++] = (tmp >> 18) | 240
          s[i++] = ((tmp >> 12) & 63) | 128
        } else {
          s[i++] = (tmp >> 12) | 224
        }

        s[i++] = ((tmp >> 6) & 63) | 128
      }

      s[i++] = (tmp & 63) | 128
    }
  }

  a = d

  for (let i = 0; i < s.length; i++) {
    a = a + s[i]
    a = create(a, one)
  }

  a = create(a, actual)

  a = a ^ (b1 || 0)

  if (a < 0) {
    a = (a & 2147483647) + 2147483648
  }

  a = a % 1e6

  return a.toString() + e + (a ^ d)
}

const create = (a, b = '') => {
  const start = 'a'
  const r = '+'
  let c = 0

  for (; c < b.length - 2; c = c + 3) {
    let d = b.charAt(c + 2)
    d = d >= start ? d.charCodeAt(0) - 87 : Number(d)
    // eslint-disable-next-line
    d = b.charAt(c + 1) == r ? a >>> d : a << d
    // eslint-disable-next-line
    a = b.charAt(c) == r ? (a + d) & 4294967295 : a ^ d
  }

  return a
}

// https://github.com/matheuss/google-translate-api
const normalize = (res = [], origin) => {
  const { text, from, to } = origin

  const result = {
    text: '',
    originText: text,
    iso: to,
    from: {
      language: {
        origin: from,
        didYouMean: false,
        iso: '',
      },
      text: {
        autoCorrected: false,
        value: '',
        didYouMean: false,
      },
    },
  }

  if (res[0]) {
    res[0].forEach((obj) => {
      if (obj[0]) {
        result.text += obj[0]
      }
    })
  }

  if (res[8] && res[8][0] && res[2] === res[8][0][0]) {
    result.from.language.iso = res[2]
  } else {
    result.from.language.didYouMean = true
    result.from.language.iso = res[8][0][0]
  }

  if (res[7] && res[7][0]) {
    let str = res[7][0]

    str = str.replace(/<b><i>/g, '[')
    str = str.replace(/<\/i><\/b>/g, ']')

    result.from.text.value = str

    if (res[7][5] === true) {
      result.from.text.autoCorrected = true
    } else {
      result.from.text.didYouMean = true
    }
  }

  return result
}

module.exports = async (params = {}) => {
  const { text = '', from = 'auto', to = 'en' } = params
  const decodedText = he.decode(text)

  const data = {
    client: 't',
    sl: from,
    tl: to,
    hl: 'zh-CN',
    dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
    ie: 'UTF-8',
    oe: 'UTF-8',
    pc: 1,
    otf: 1,
    ssel: 0,
    tsel: 0,
    kc: 1,
    tk: genToken(decodedText),
    q: decodedText,
  }
  const res = await superagent.post(
    GOOGLE_TRANSLATE_URL,
    qs.stringify(data, {
      arrayFormat: 'repeat',
    }),

  ).set({
    "User-Agent": randomHead(),
    "X-Forwarded-For": returnIp()
  })

  const result = await normalize(res.data, {
    text,
    from,
    to,
  })

  return result
}