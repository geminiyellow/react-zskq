import I18n from 'react-native-i18n';
import realm from '@/realm';
import { translations, languageType } from './LanguageSettingData';
import { device, keys } from './Util';
I18n.fallbacks = true
I18n.translations = translations;
const configLan = realm.objects('Config').filtered('name="language"');
if (configLan.length != 0 && configLan[0].value != '0') {
  I18n.locale = languageType[parseInt(configLan[0].value) - 1];
} else {
  switchLanguage();
}

function switchLanguage() {
  let k = 1;
  languageType.map(item => {
    if (device.mobileLocale == item) {
      k = languageType.indexOf(item);
    }
    return true;
  });
  I18n.locale = languageType[k];
}