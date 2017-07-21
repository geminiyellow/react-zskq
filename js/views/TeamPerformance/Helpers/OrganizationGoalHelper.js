import _ from 'lodash';

module.exports = {
  // 0 代表组织列表类型 1 代表考核期列表类型
  // 解析组织列表数据
  onGetOrganizationListInfo(data) {
    if (_.isEmpty(data)) {
      return '';
    }
    let resultArr = [];
    for (let i = 0; i < data.length; i++) {
      let item = {};
      item.Type = 0;
      item.Description = data[i].label;
      item.selected = i == 0 ? true : false;
      item.value = data[i].value;
      resultArr.push(item);
    }
    return resultArr;
  },
  // 解析考核期列表数据
  onGetPeriodListInfo(data) {
    if (_.isEmpty(data)) {
      return '';
    }
    // { value: '201703', label: '201703', periodType: 'P00020001' }
    let resultArr = [];
    for (let i = 0; i < data.options.length; i++) {
      let item = {};
      item.Type = 1;
      item.Description = data.options[i].label;
      item.selected = i == 0 ? true : false;
      resultArr.push(item);
    }
    return resultArr;
  },
};