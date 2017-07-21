// Filter Data
module.exports = {
  initFilterData: [
    {
      id: '0',
      title: '',
      selected: false,
    },
    {
      id: '1',
      title: '',
      selected: false,
    },
    {
      id: '2',
      title: '',
      selected: false,
    },
  ],
  // 获取Filter数据源
  getFilterDatasource(index, title, filterData) {
    let data = filterData;
    filterData[index].title = title;
    return data;
  },
};