import I18n from 'react-native-i18n';

module.exports = {
  // 根据HROne配置参数返回指定顺序星期数组
  weekOrderArray(startDay) {
    if (startDay == 0) return [`${I18n.t('mobile.consts.week.sunday')}`, `${I18n.t('mobile.consts.week.monday')}`, `${I18n.t('mobile.consts.week.tuesday')}`, `${I18n.t('mobile.consts.week.wednesday')}`, `${I18n.t('mobile.consts.week.thurday')}`, `${I18n.t('mobile.consts.week.friday')}`, `${I18n.t('mobile.consts.week.saturday')}`];

    if (startDay == 1) return [`${I18n.t('mobile.consts.week.monday')}`, `${I18n.t('mobile.consts.week.tuesday')}`, `${I18n.t('mobile.consts.week.wednesday')}`, `${I18n.t('mobile.consts.week.thurday')}`, `${I18n.t('mobile.consts.week.friday')}`, `${I18n.t('mobile.consts.week.saturday')}`, `${I18n.t('mobile.consts.week.sunday')}`];

    if (startDay == 2) return [`${I18n.t('mobile.consts.week.tuesday')}`, `${I18n.t('mobile.consts.week.wednesday')}`, `${I18n.t('mobile.consts.week.thurday')}`, `${I18n.t('mobile.consts.week.friday')}`, `${I18n.t('mobile.consts.week.saturday')}`, `${I18n.t('mobile.consts.week.sunday')}`, `${I18n.t('mobile.consts.week.monday')}`];

    if (startDay == 3) return [`${I18n.t('mobile.consts.week.wednesday')}`, `${I18n.t('mobile.consts.week.thurday')}`, `${I18n.t('mobile.consts.week.friday')}`, `${I18n.t('mobile.consts.week.saturday')}`, `${I18n.t('mobile.consts.week.sunday')}`, `${I18n.t('mobile.consts.week.monday')}`, `${I18n.t('mobile.consts.week.tuesday')}`];

    if (startDay == 4) return [`${I18n.t('mobile.consts.week.thurday')}`, `${I18n.t('mobile.consts.week.friday')}`, `${I18n.t('mobile.consts.week.saturday')}`, `${I18n.t('mobile.consts.week.sunday')}`, `${I18n.t('mobile.consts.week.monday')}`, `${I18n.t('mobile.consts.week.tuesday')}`, `${I18n.t('mobile.consts.week.wednesday')}`];

    if (startDay == 5) return [`${I18n.t('mobile.consts.week.friday')}`, `${I18n.t('mobile.consts.week.saturday')}`, `${I18n.t('mobile.consts.week.sunday')}`, `${I18n.t('mobile.consts.week.monday')}`, `${I18n.t('mobile.consts.week.tuesday')}`, `${I18n.t('mobile.consts.week.wednesday')}`, `${I18n.t('mobile.consts.week.thurday')}`];

    if (startDay == 6) return [`${I18n.t('mobile.consts.week.saturday')}`, `${I18n.t('mobile.consts.week.sunday')}`, `${I18n.t('mobile.consts.week.monday')}`, `${I18n.t('mobile.consts.week.tuesday')}`, `${I18n.t('mobile.consts.week.wednesday')}`, `${I18n.t('mobile.consts.week.thurday')}`, `${I18n.t('mobile.consts.week.friday')}`];

    return [`${I18n.t('mobile.consts.week.sunday')}`, `${I18n.t('mobile.consts.week.monday')}`, `${I18n.t('mobile.consts.week.tuesday')}`, `${I18n.t('mobile.consts.week.wednesday')}`, `${I18n.t('mobile.consts.week.thurday')}`, `${I18n.t('mobile.consts.week.friday')}`, `${I18n.t('mobile.consts.week.saturday')}`];
  }
};