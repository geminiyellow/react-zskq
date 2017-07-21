/**
 * 获取考核期帮助类
 */
import {
  InteractionManager,
} from 'react-native';
import { GetPeriodType, getSelfPerformanceFilter } from '@/common/api';
import { GET, ABORT } from '@/common/Request';

let types = [];
// [
//   {
//     label: "月度",
//     value: "P00020001"
//   },
//   {
//     label: "季度",
//     value: "P00020002"
//   },
//   {
//     label: "半年度",
//     value: "P00020003"
//   },
//   {
//     label: "年度",
//     value: "P00020004"
//   }];

let instance = null;

let filterResult = [];
// [{
//   value: 'P00020001',
//   label: '月度',
//   quotalists: [{ value: '1', label: '佣金' }]
// },
// {
//   value: 'P00020002',
//   label: '季度',
//   quotalists: [{ value: '1', label: '佣金' }]
// },
// {
//   value: 'P00020003',
//   label: '半年度',
//   quotalists: [{ value: '1', label: '佣金' }]
// },
// {
//   value: 'P00020004',
//   label: '年度',
//   quotalists: [{ value: '1', label: '佣金' }]
// }];

export default class PeriodTypeHelper {
  constructor() {
    if (instance == null) {
      instance = this;
    }
    return instance;
  }

  /**
   * 获取考核期请求
   */
  sendRequest() {
    GET(GetPeriodType(), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        types = responseData;
      });
    }, (err) => {
    }, 'GetPeriodType');
  }
  /**
   * 获取个人绩效的筛选条件
   */
  sendSelfPerformanceFilterRequest() {
    GET(getSelfPerformanceFilter(), (responseData) => {
      InteractionManager.runAfterInteractions(() => {
        // let responseData = [{
        //   value: 'P00020001',
        //   label: '月度',
        //   quotalists: [{ value: '1', label: '佣金' }]
        // },
        // {
        //   value: 'P00020002',
        //   label: '季度',
        //   quotalists: [{ value: '1', label: '佣金' }]
        // },
        // {
        //   value: 'P00020003',
        //   label: '半年度',
        //   quotalists: [{ value: '1', label: '佣金' }]
        // },
        // {
        //   value: 'P00020004',
        //   label: '年度',
        //   quotalists: [{ value: '1', label: '佣金' }]
        // }];
        filterResult = responseData;
        let filterData = responseData;
        if (filterData && filterData.length > 0) {
          let index = 0;
          firstModalValues = [];
          filterData.map(item => {
            let temp = {};
            temp.Description = item.label;
            temp.Type = item.value;
            if (index == 0)
              temp.selected = true;
            else
              temp.selected = false;
            firstModalValues.push(temp);
            index = index + 1;
          });
          secondModalValues = [];
          secondModalValues = filterData[0].quotalists;
        }

      });
    }, (err) => {
    }, 'getSelfPerformanceFilter');
  }

  getPeriodTypes() {
    return types;
  }

  getFilterResult() {
    return filterResult;
  }

}