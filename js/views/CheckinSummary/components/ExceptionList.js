import { ListView, TouchableOpacity, View } from "react-native";
import React, { PureComponent } from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import I18n from "react-native-i18n";
import Style from "@/common/Style";
import { device } from "@/common/Util";
import Line from "@/common/components/Line";
import Text from "@/common/components/TextField";
import { getHHmmFormat } from "@/common/Functions";
import Image from "@/common/components/CustomImage";
import Constance from "./../constants";
import ExceptionSubmit from "./ExceptionSubmit";
import MyFormHelper from "./../../MyForms/MyFormHelper";

const myFormHelper = new MyFormHelper();
const forwardImage = "exception_forward";

export default class ExceptionList extends PureComponent {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      unhandledExceptionList: this.dataSource,
      unhandleExceptionNum: 0,
      isDataValid: false
    };
  }

  componentDidMount() {
    const { unhandledExceptionList, unhandleExceptionNum } = this.props;
    this.setState({
      unhandledExceptionList: this.state.unhandledExceptionList.cloneWithRows(
        unhandledExceptionList
      ),
      unhandleExceptionNum,
      isDataValid: true
    });
  }

  componentWillReceiveProps(nextProps) {
    const { unhandledExceptionList, unhandleExceptionNum } = nextProps;
    this.setState({
      unhandledExceptionList: this.state.unhandledExceptionList.cloneWithRows(
        unhandledExceptionList
      ),
      unhandleExceptionNum,
      isDataValid: true
    });
  }

  /**
   * 申请的页面
   */
  onUnhandleRowSelected(rowData, sectionID, rowID) {
    const { navigator } = this.props;
    if (rowData.ExceptionVisible == 0) {
      return;
    }
    navigator.push({
      component: ExceptionSubmit,
      passProps: {
        attendanceData: rowData,
        dateColor: this.renderColor(rowData),
      }
    });
  }

  /**
   * 渲染底部的横线
   */
  renderSeparator(sectionID, rowID) {
    const lastRow =
      rowID == this.state.unhandledExceptionList.getRowCount() - 1;
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{ backgroundColor: Style.color.white }}
      >
        <Line
          style={[!lastRow && styles.separator, { backgroundColor: "#EBEBEB" }]}
        />
      </View>
    );
  }

  /**
   * 颜色的设置
   */
  renderColor(rowData) {
    if (rowData.ExceptionType == "F") {
      return "#FFC62D";
    } else if (rowData.ExceptionType == "G") {
      return "#2591FF";
    }
    return "#999999";
  }

  /**
   * 根据异常的类型来显示应打卡时间和实际打卡时间
   */
  renderActualCheckinTime(rowData) {
    if (rowData.ExceptionType === "M" || rowData.ActualPunchTime == "") {
      return (
        <View style={{ flexDirection: "row", marginBottom: 5 }}>
          <Text style={styles.checkinDetailsLabel}>
            {I18n.t('mobile.module.exception.shouldcheckintime')}
            <Text style={styles.checkinDetailsTime}>
              {getHHmmFormat(rowData.PlanPunchTime)}
            </Text>
          </Text>
        </View>
      );
    }

    return (
      <View style={{ flexDirection: 'row', marginBottom: 5 }}>
        <Text style={styles.checkinDetailsLabel} numberOfLines={1}>
          {I18n.t('mobile.module.exception.actualcheckintime')}
          <Text style={styles.checkinDetailsTime}>
            {getHHmmFormat(rowData.ActualPunchTime)}
          </Text>
        </Text>
        <Line style={styles.timeSeperator} />
        <Text style={styles.checkinDetailsLabel} numberOfLines={1}>
          {I18n.t('mobile.module.exception.shouldcheckintime')}
          <Text style={styles.checkinDetailsTime}>{getHHmmFormat(rowData.PlanPunchTime)}</Text>
        </Text>
      </View>
    );
  }

  /**
   * 显示每一行的数据的
   */
  renderUnhandleExceptionRowData(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity
        key={`${sectionID}-${rowID}`}
        activeOpacity={0.5}
        onPress={() => this.onUnhandleRowSelected(rowData, sectionID, rowID)}
        style={styles.exceptionListRowItem}
      >
        <View style={styles.circleBg}>
          <Text
            style={[styles.circleMonth, { color: this.renderColor(rowData) }]}
          >
            {Constance.getMonth(
              rowData.ExceptionMonth,
              myFormHelper.getLanguage()
            )}
          </Text>
          <Text style={[styles.circleDay, { color: this.renderColor(rowData) }]}>
            {rowData.ExceptionDay}
          </Text>
        </View>
        <View style={{ width: device.width - 100, marginVertical: 10 }}>
          <Text style={styles.exceptionTitle} numberOfLines={1}>
            {rowData.ExceptionName}
          </Text>
          {this.renderActualCheckinTime(rowData)}
        </View>
        {rowData.ExceptionVisible == undefined || rowData.ExceptionVisible == 1
          ? <Image style={styles.forwardImage} source={{ uri: forwardImage }} />
          : null}
      </TouchableOpacity>
    );
  }

  renderExceptionList() {
    const { isDataValid, unhandledExceptionList } = this.state;
    if (isDataValid) {
      return (
        <ListView
          removeClippedSubviews={false}
          scrollEnabled={false}
          enableEmptySections
          dataSource={unhandledExceptionList}
          renderSeparator={(sectionID, rowID) =>
            this.renderSeparator(sectionID, rowID)}
          renderRow={(rowData, sectionID, rowID) =>
            this.renderUnhandleExceptionRowData(rowData, sectionID, rowID)}
        />
      );
    }
    return null;
  }

  render() {
    return (
      <View>
        {this.renderExceptionList()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  exceptionListRowItem: {
    flexDirection: "row",
    backgroundColor: "$color.white",
    alignItems: "center"
  },
  circleBg: {
    marginVertical: 10,
    marginLeft: 18,
    marginRight: 18,
    width: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  circleDay: {
    fontSize: 28
  },
  circleMonth: {
    fontSize: 13
  },
  exceptionTitle: {
    flex: 1,
    color: "#000000",
    width: device.width - 95,
    fontSize: 17,
    fontWeight: "bold"
  },
  separator: {
    marginLeft: 18
  },
  checkinDetailsLabel: {
    fontSize: 13,
    color: "#A6A6A6",
  },
  checkinDetailsTime: {
    fontSize: 13,
    color: "$color.mainColorLight",
    '@media ios': {
      fontWeight: '500',
    },
  },
  timeSeperator: {
    width: device.hairlineWidth * 2,
    height: 10,
    backgroundColor: "#999999",
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  forwardImage: {
    width: 8,
    height: 13
  }
});
