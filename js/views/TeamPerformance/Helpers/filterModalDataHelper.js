// FilterModal数据格式化
module.exports = {
  // 格式化传入的数组支持FilterModal数据源格式
  filterModalDataFormat(data) {
    let modalData = [];
    if (data) {
      for (let value of data) {
        let item = {
          Description: '',
          selected: false,
        };
        item.Description = value;
        modalData.push(item);
      }
    }
    if (modalData.length > 0) {
      modalData[0].selected = true;
    }
    return modalData;
  },
  // 人员指标 格式化 组织、人员指标、考核期类型信息 为filterModal 数据源格式
  filterModalDataFormatTeam(data, pointer) {
    let modalData = [];
    if (data && data.length != 0) {
      for (let i = 0; i < data.length; i ++) {
        let item = {};
        item.Description = pointer ? data[i].IndicatorName : data[i].label;
        item.selected = i == 0 ? true : false;
        modalData.push(item);
      }
    }
    return modalData;
  },
};