/**
 *  佣金计算的常量和方法
 */
import I18n from 'react-native-i18n';

module.exports = {

  /**
   * 初始化筛选的数据
   */
  initFilterTitle(originId, timesId) {
    const filterArr = [];
    filterArr.push({
      id: '0',
      title: (timesId) ? timesId : I18n.t('mobile.module.achievements.tab.assessmentperiod'),
      selected: false,
    });
    filterArr.push({
      id: '1',
      title: (originId) ? originId : I18n.t('mobile.module.achievements.tab.organization'),
      selected: false,
    });
    return filterArr;
  },

  /**
   * 加载数据
   */
  initSelectData(dataTemp, type, index) {
    const data = [];
    for (let i = 0; i < dataTemp.length; i++) {
      const temp = {};
      if (i == index) {
        data.push({ Index: i, Description: dataTemp[i].label, Id: dataTemp[i].value, Type: type, selected: true });
      } else {
        data.push({ Index: i, Description: dataTemp[i].label, Id: dataTemp[i].value, Type: type, selected: false });
      }
    }
    return data;
  },
};