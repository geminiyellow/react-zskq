import en from './I18n/en';
import zh from './I18n/zh';
import ko from './I18n/ko';
import ja from './I18n/ja';
import fr from './I18n/fr';
import de from './I18n/de';
import th from './I18n/th';
import cht from './I18n/cht';

module.exports = {
  // 语言支持列表
  lan: [
    {
      language: 'mobile.module.language.autonmatic',
      icon: 'automatic',
      selected: true,
      code: 'Automatic',
    },
    {
      language: 'mobile.module.language.chinese',
      icon: 'simplified_chinese',
      selected: false,
      code: 'ZH-CN',
    },
    {
      language: 'mobile.module.language.english',
      icon: 'english',
      selected: false,
      code: 'EN-US',
    },
    {
      language: 'mobile.module.language.korean',
      icon: 'korean',
      selected: false,
      code: 'KO-KR',
    },
    {
      language: 'mobile.module.language.japanese',
      icon: 'japanese',
      selected: false,
      code: 'JA-JP',
    },
    {
      language: 'companyCodeFrance',
      icon: 'fr',
      selected: false,
      code: 'FR-FR',
    },
    {
      language: 'companyCodeGerman',
      icon: 'german',
      selected: false,
      code: 'DE-DE',
    },
    {
      language: 'companyCodeTailand',
      icon: 'tailand',
      selected: false,
      code: 'TH-TH',
    },
      {
      language: 'companyCodeTraditional',
      icon: 'traditional',
      selected: false,
      code: 'ZH-CHT',
    },
  ],
  // Hello
  helloType: ['您好', 'Hello', '안녕하세요.', 'こんにちは', 'Bonjour', 'Hallo', 'สวัสดี', '您好'],
  // 国际化编码
  languages: [
    // 中文简体
    'ZH-CN',
    // 英语
    'EN-US',
    // 韩语
    'KO-KR',
    // 日语
    'JA-JP',
    // 法语
    'FR-FR',
    // 德语
    'DE-DE',
    // 泰语
    'TH-TH',
    // 中文繁体
    'ZH-CHT',
  ],
  languageType: ['zh', 'en', 'ko', 'ja', 'fr', 'de', 'th', 'cht'],
  // 国际化支持的语言
  translations: {
    // 中文简体
    zh,
    // 英语
    en,
    // 韩语
    ko,
    // 日语
    ja,
    // 法语
    fr,
    // 德语
    de,
    // 泰语
    th,
    // 中文繁体
    cht,
  },
};
