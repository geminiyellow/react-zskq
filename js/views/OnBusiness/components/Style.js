// 出差模块通用样式

import { device } from '@/common/Util';

module.exports = {
  color: {
    mainColor: '#14BE4B',
    // 标题文字
    titleColor: '#000000',
    // 详细文字
    detailColor: '#666666',
    // 单行文本框提示颜色
    placeholderColor: '#a3a3a3',
  },
  size: {
    rowHeight: 48,
    rowWidth: device.width,
    forwardImageWidth: 22,
    forwardImageHeight: 22,
  },
  // 间距
  space: {
    // 组件间间距
    rowVerticalSpace: 10,
    rowLeftSpace: 18,
    rowRightSpace: 11,
  },
  font: {
    // 行标题文字
    titleFontSize: 18,
    // 详细文字
    detailFontSize: 14,
  },
};