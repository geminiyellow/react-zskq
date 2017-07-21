import I18n from 'react-native-i18n';

module.exports = {
  // 请假模式数据源
  initLeaveModalArr() {
    const leaveModalArr = [];
    leaveModalArr.push(I18n.t('mobile.module.leaveapply.leaveapplymodalfullday'));
    leaveModalArr.push(I18n.t('mobile.module.leaveapply.leaveapplymodalfirsthalfestee'));
    leaveModalArr.push(I18n.t('mobile.module.leaveapply.leaveapplymodalsecndhalfestee'));
    leaveModalArr.push(I18n.t('mobile.module.leaveapply.leaveapplymodaldelayworkestee'));
    leaveModalArr.push(I18n.t('mobile.module.leaveapply.leaveapplymodalearlyworkestee'));
    leaveModalArr.push(I18n.t('mobile.module.leaveapply.leaveapplymodalflextime'));

    return leaveModalArr;
  },
  initLeaveModalNXYArr() {
    const leaveModalArr = [];
    leaveModalArr.push(I18n.t('mobile.module.leaveapply.leaveapplymodalfullday'));
    leaveModalArr.push(I18n.t('mobile.module.leaveapply.leaveapplymodalfirsthalfestee'));
    leaveModalArr.push(I18n.t('mobile.module.leaveapply.leaveapplymodalsecndhalfestee'));
    leaveModalArr.push(I18n.t('mobile.module.leaveapply.leaveapplymodaldelayworkestee'));
    leaveModalArr.push(I18n.t('mobile.module.leaveapply.leaveapplymodalearlyworkestee'));

    return leaveModalArr;
  },
  // 延迟上班／提前下班 请假模式数据源
  leaveModalHourArr: [
    '0.5',
    '1',
    '1.5',
    '2',
    '2.5',
    '3',
    '3.5',
    '4',
    '4.5',
    '5',
    '5.5',
    '6',
    '6.5',
    '7',
    '7.5',
    '8',
  ],
};