import I18n from 'react-native-i18n';

module.exports = {

  // 筛选数据
  initFilterArr(originId, timesId) {
    const filterArr = [];
    filterArr.push({
      id: '1',
      title: (originId) ? originId : I18n.t('mobile.module.achievements.tab.data'),
      selected: false,
    });
    filterArr.push({
      id: '0',
      title: (timesId) ? timesId : I18n.t('mobile.module.achievements.tab.department'),
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