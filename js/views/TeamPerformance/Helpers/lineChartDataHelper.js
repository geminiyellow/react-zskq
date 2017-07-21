module.exports = {
  getXValues(completedData) {
    let chartXValues = [];
    if (completedData) {
      for (let item of completedData) {
        let data = item.x;
        chartXValues.push(data);
      }
    }
    return chartXValues;
  },
  // 判断是否目标值、完成值都为0
  isEmpty(completedData, targetData) {
    let isEmpty = true;
    if (!Array.isArray(completedData) || !Array.isArray(targetData)) {
      return isEmpty;
    }
    for (let item of completedData) {
      if (item && item.y > 0) {
        isEmpty = false;
        break;
      }
    }
    for (let item of targetData) {
      if (item && item.y > 0) {
        isEmpty = false;
        break;
      }
    }
    return isEmpty;
  },
};