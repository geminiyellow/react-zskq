import I18n from 'react-native-i18n';

module.exports = {
  // 请假模式数据源
  initFilterArr() {
    const filterArr = [];
    filterArr.push({
      id: '0',
      title: I18n.t('mobile.module.achievements.tab.organization'),
      selected: false,
    });
    filterArr.push({
      id: '1',
      title: I18n.t('mobile.module.achievements.tab.assessmentperiod'),
      selected: false,
    });
    filterArr.push({
      id: '2',
      title: I18n.t('mobile.module.achievements.tab.type'),
      selected: false,
    });

    return filterArr;
  },
  initOrganizationGoalFilterArr() {
    const filterArr = [];
    filterArr.push({
      id: '0',
      title: '',
      selected: false,
    });
    filterArr.push({
      id: '1',
      title: '',
      selected: false,
    });

    return filterArr;
  },
  initFilterModalArr() {
    const filterModalArr = [];
    filterModalArr.push({ Description: I18n.t('mobile.module.achievements.tab.assessmentperiod.month'), Type: 'Month', selected: true });
    filterModalArr.push({ Description: I18n.t('mobile.module.achievements.tab.assessmentperiod.quarter'), Type: 'Quarter', selected: false });
    filterModalArr.push({ Description: I18n.t('mobile.module.achievements.tab.assessmentperiod.halfyear'), Type: 'HalfYear', selected: false });
    filterModalArr.push({ Description: I18n.t('mobile.module.achievements.tab.assessmentperiod.year'), Type: 'Year', selected: false });
    return filterModalArr;
  },
  initFilterModalArrTemp() {
    const filterModalArr = [];
    filterModalArr.push({ Description: '测试1', Type: 'Month', selected: true });
    filterModalArr.push({ Description: '测试2', Type: 'Quarter', selected: false });
    filterModalArr.push({ Description: '测试3', Type: 'HalfYear', selected: false });
    filterModalArr.push({ Description: '测试4', Type: 'Year', selected: false });
    filterModalArr.push({ Description: '测试1', Type: 'Month', selected: false });
    filterModalArr.push({ Description: '测试2', Type: 'Quarter', selected: false });
    filterModalArr.push({ Description: '测试3', Type: 'HalfYear', selected: false });
    filterModalArr.push({ Description: '测试4', Type: 'Year', selected: false });
    filterModalArr.push({ Description: '测试1', Type: 'Month', selected: false });
    filterModalArr.push({ Description: '测试2', Type: 'Quarter', selected: false });
    filterModalArr.push({ Description: '测试3', Type: 'HalfYear', selected: false });
    filterModalArr.push({ Description: '测试4', Type: 'Year', selected: false });
    return filterModalArr;
  },
};