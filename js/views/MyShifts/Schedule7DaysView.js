import React, { Component } from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Util from '@/views/MyShifts/Util';
import Line from '@/common/components/Line';
import { device } from '@/common/Util';
import _ from 'lodash';
import ScheduleNext from '@/common/components/schedule/ScheduleNext';

export default class Schedule7DaysView extends Component {

  onRenderScheduleListInfo() {
    const date = this.props.scheduleDate;
    let scheduleDataSources = this.props.dateSources;
    // console.log('scheduleDataSources', scheduleDataSources);
    let scheduleList = [];
    const dateArr = Util.get7DatesArr(date);
    // 取出指定日期的月份
    let datt = date.split('-');
    // 月份显示参数 只显示一个月份
    this.isShowMonth = true;
    // 获取7天后的日期
    const lastDate = dateArr[6];
    if (_.isEmpty(scheduleDataSources)) {
      for (let i = 0; i < dateArr.length; i++) {
        let dateTemp = dateArr[i];
        let dateTempArr = dateTemp.split('-');
        if (i == 6) {

          if (dateTempArr[1] == datt[1]) {
            scheduleList.push(
              <View key={i}>{this.onRenderScheduleItem(0, dateTempArr[1], dateTemp, false, '')}</View>
            );
          } else {
            if (this.isShowMonth) {
              this.isShowMonth = false;
              scheduleList.push(
                <View key={i}>{this.onRenderScheduleItem(0, dateTempArr[1], dateTemp, true, '')}</View>
              );
            } else {
              scheduleList.push(
                <View key={i}>{this.onRenderScheduleItem(0, dateTempArr[1], dateTemp, false, '')}</View>
              );
            }
          }
        } else {
          if (dateTempArr[1] == datt[1]) {
            scheduleList.push(
              <View key={i} style={{ flexDirection: 'column' }}>
                {this.onRenderScheduleItem(0, dateTempArr[1], dateTemp, false, '')}
                {this.onRnderLine()}
              </View>
            );
          } else {
            if (this.isShowMonth) {
              this.isShowMonth = false;
              scheduleList.push(
                <View key={i} style={{ flexDirection: 'column' }}>
                  {this.onRenderScheduleItem(0, dateTempArr[1], dateTemp, true, '')}
                  {this.onRnderLine()}
                </View>
              );
            } else {
              scheduleList.push(
                <View key={i} style={{ flexDirection: 'column' }}>
                  {this.onRenderScheduleItem(0, dateTempArr[1], dateTemp, false, '')}
                  {this.onRnderLine()}
                </View>
              );
            }
          }
        }

      }
    } else {
      // 有排班情况
      // 处理数据源 生成新数组
      let scheduleDateArr = [];
      for (let j = 0; j < scheduleDataSources.length; j++) {
        scheduleDateArr.push(scheduleDataSources[j].shiftDate);
      }
      for (let i = 0; i < dateArr.length; i++) {
        let dateTemp = dateArr[i];
        let dateTempArr = dateTemp.split('-');
        let scheduleInfos = scheduleDataSources;
        let itemIndex = scheduleDateArr.indexOf(dateTemp);

        if (i == 6) {
          // 最后一个 不显示底线
          if (itemIndex == -1) {
            // 显示暂无排班
            if (dateTempArr[1] == datt[1]) {
              scheduleList.push(
                <View key={i}>{this.onRenderScheduleItem(0, dateTempArr[1], dateTemp, false, '')}</View>
              );
            } else {
              if (this.isShowMonth) {
                this.isShowMonth = false;
                scheduleList.push(
                  <View key={i}>{this.onRenderScheduleItem(0, dateTempArr[1], dateTemp, true, '')}</View>
                );
              } else {
                scheduleList.push(
                  <View key={i}>{this.onRenderScheduleItem(0, dateTempArr[1], dateTemp, false, '')}</View>
                );
              }
            }
          } else {
            /////////////////////////////////////////////////////////
            // 显示排班信息
            if (scheduleDataSources[itemIndex].hours == 0) {
              // 休息班
              if (dateTempArr[1] == datt[1]) {
                scheduleList.push(
                  <View key={i} style={{ flexDirection: 'column' }}>
                    {this.onRenderScheduleItem(1, dateTempArr[1], dateTemp, false, '')}
                    {this.onRnderLine()}
                  </View>
                );
              } else {
                if (this.isShowMonth) {
                  this.isShowMonth = false;
                  scheduleList.push(
                    <View key={i} style={{ flexDirection: 'column' }}>
                      {this.onRenderScheduleItem(1, dateTempArr[1], dateTemp, true, '')}
                      {this.onRnderLine()}
                    </View>
                  );
                } else {
                  scheduleList.push(
                    <View key={i} style={{ flexDirection: 'column' }}>
                      {this.onRenderScheduleItem(1, dateTempArr[1], dateTemp, false, '')}
                      {this.onRnderLine()}
                    </View>
                  );
                }
              }
            } else {
              // 正常班
              if (dateTempArr[1] == datt[1]) {
                scheduleList.push(
                  <View key={i}>
                    {this.onRenderScheduleItem(2, dateTempArr[1], dateTemp, false, scheduleDataSources[itemIndex])}
                  </View>
                );
              } else {
                if (this.isShowMonth) {
                  this.isShowMonth = false;
                  scheduleList.push(
                    <View key={i}>
                      {this.onRenderScheduleItem(2, dateTempArr[1], dateTemp, true, scheduleDataSources[itemIndex])}
                    </View>
                  );
                } else {
                  scheduleList.push(
                    <View key={i}>
                      {this.onRenderScheduleItem(2, dateTempArr[1], dateTemp, false, scheduleDataSources[itemIndex])}
                    </View>
                  );
                }
              }
            }
          }
        } else {
          ///////////////////////////////////////////////////////////////
          // 显示底线
          if (itemIndex == -1) {
            // 显示未排班信息
            if (dateTempArr[1] == datt[1]) {
              scheduleList.push(
                <View key={i} style={{ flexDirection: 'column' }}>
                  {this.onRenderScheduleItem(0, dateTempArr[1], dateTemp, false, '')}
                  {this.onRnderLine()}
                </View>
              );
            } else {
              if (this.isShowMonth) {
                this.isShowMonth = false;
                scheduleList.push(
                  <View key={i} style={{ flexDirection: 'column' }}>
                    {this.onRenderScheduleItem(0, dateTempArr[1], dateTemp, true, '')}
                    {this.onRnderLine()}
                  </View>
                );
              } else {
                scheduleList.push(
                  <View key={i} style={{ flexDirection: 'column' }}>
                    {this.onRenderScheduleItem(0, dateTempArr[1], dateTemp, false, '')}
                    {this.onRnderLine()}
                  </View>
                );
              }
            }
          } else {
            ////////////////////////////////////////////////////
            // 展示排班信息
            // 是否为休息班
            if (scheduleDataSources[itemIndex].hours == 0) {
              // 休息班
              if (dateTempArr[1] == datt[1]) {
                scheduleList.push(
                  <View key={i} style={{ flexDirection: 'column' }}>
                    {this.onRenderScheduleItem(1, dateTempArr[1], dateTemp, false, '')}
                    {this.onRnderLine()}
                  </View>
                );
              } else {
                if (this.isShowMonth) {
                  this.isShowMonth = false;
                  scheduleList.push(
                    <View key={i} style={{ flexDirection: 'column' }}>
                      {this.onRenderScheduleItem(1, dateTempArr[1], dateTemp, true, '')}
                      {this.onRnderLine()}
                    </View>
                  );
                } else {
                  scheduleList.push(
                    <View key={i} style={{ flexDirection: 'column' }}>
                      {this.onRenderScheduleItem(1, dateTempArr[1], dateTemp, false, '')}
                      {this.onRnderLine()}
                    </View>
                  );
                }
              }
            } else {
              // 正常班
              if (dateTempArr[1] == datt[1]) {
                scheduleList.push(
                  <View key={i} style={{ flexDirection: 'column' }}>
                    {this.onRenderScheduleItem(2, dateTempArr[1], dateTemp, false, scheduleDataSources[itemIndex])}
                    {this.onRnderLine()}
                  </View>
                );
              } else {
                if (this.isShowMonth) {
                  this.isShowMonth = false;
                  scheduleList.push(
                    <View key={i} style={{ flexDirection: 'column' }}>
                      {this.onRenderScheduleItem(2, dateTempArr[1], dateTemp, true, scheduleDataSources[itemIndex])}
                      {this.onRnderLine()}
                    </View>
                  );
                } else {
                  scheduleList.push(
                    <View key={i} style={{ flexDirection: 'column' }}>
                      {this.onRenderScheduleItem(2, dateTempArr[1], dateTemp, false, scheduleDataSources[itemIndex])}
                      {this.onRnderLine()}
                    </View>
                  );
                }
              }
            }
          }
        }
      }
    }

    return scheduleList;
  }

  onRenderScheduleItem(scheduleType, monthName, scheduleDate, isMonthItemShow, scheduleInfo) {
    return (
      <ScheduleNext
        scheduleType={scheduleType}
        monthName={monthName}
        scheduleDate={scheduleDate}
        isMonthItemShow={isMonthItemShow}
        scheduleInfo={scheduleInfo} />
    );
  }

  onRnderLine() {
    return (
      <View style={{ flexDirection: 'row' }}>
        <View style={{ width: device.width * 0.051, backgroundColor: '#ffffff', height: 1 }} />
        <Line style={styles.lineStyle} />
        <View style={{ width: device.width * 0.065, backgroundColor: '#ffffff', height: 1 }} />
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.onRenderScheduleListInfo()}
      </View>
    );
  }

}

const styles = EStyleSheet.create({
  lineStyle: {
    backgroundColor: '#f0f0f0',
    height: 1,
    width: device.width * 0.885,
  },
});