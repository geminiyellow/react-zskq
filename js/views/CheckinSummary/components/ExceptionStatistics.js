/**
 * 头部分析
 */
import { ListView, View } from 'react-native';
import React, { PureComponent } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import { device } from '@/common/Util';

export default class ExceptionStatistics extends PureComponent {

  constructor(props) {
    super(props);
    this.count = 0;
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      attendanceStatistics: this.dataSource,
      isDataValid: false,
    };
  }

  /** Life cycle */

  componentDidMount() {
    // 计数
    this.count = 0;
    const { attendanceStatistics } = this.props;
    this.setState({
      attendanceStatistics: this.state.attendanceStatistics.cloneWithRows(
        attendanceStatistics,
      ),
      isDataValid: true,
    });
  }

  componentWillReceiveProps(nextProps) {
    // 计数
    this.count = 0;
    const { attendanceStatistics } = nextProps;
    this.setState({
      attendanceStatistics: this.state.attendanceStatistics.cloneWithRows(
        attendanceStatistics,
      ),
      isDataValid: true,
    });
  }

  /** Render methods */

  /**
   * 颜色的设置
   */
  renderColor(type) {
    if (type == 'F') {
      return '#FFC62D';
    } else if (type == 'G') {
      return '#2591FF';
    }
    return '#999999';
  }

  renderRowData(rowData, sectionID, rowID) {
    // 获取数据的大小
    let size = this.props.attendanceStatistics.length % 2;
    if (size == 0) {
      size = 2;
    }
    if (this.props.attendanceStatistics.length >= 2) {
      size = 2;
    }
    // 设置颜色
    let colorText = '';
    if (rowData.Type) {
      colorText = this.renderColor(rowData.Type);
    } else {
      colorText = '#14BE4B';
    }
    return (
      <View key={`${sectionID}-${rowID}`} style={{ height: 73, width: (device.width-36)/2, flexDirection: 'row' }}>
        <View style={[styles.rowItem]}>
          <View style={styles.rowItemTimes}>
            <Text style={[styles.rowItemTimesTextF, { color: colorText }]}>
              {`${rowData.Count}`}
            </Text>
            <View style={styles.rowItemTimesTextSBg}>
              <Text style={[styles.rowItemTimesTextS, { color: colorText }]}>
                {I18n.t('mobile.module.exception.excetimes')}
              </Text>
            </View>
          </View>
          <Text numberOfLines={3} style={styles.rowItemTitle}>
            {rowData.Name}
          </Text>
        </View>
      </View>
    );
  }



  renderAttendanceStatistics() {
    const { isDataValid, attendanceStatistics } = this.state;
    // 含有数据的页面
    if (isDataValid) {
      return (
        <View style={styles.attendanceListWrapper}>
          <ListView
            style={styles.listView}
            pageSize={2}
            contentContainerStyle={styles.listItem}
            removeClippedSubviews={false}
            scrollEnabled={false}
            enableEmptySections
            dataSource={attendanceStatistics}
            renderRow={(rowData, sectionID, rowID) =>
              this.renderRowData(rowData, sectionID, rowID)}
          />
        </View>
      );
    }
    // 空的页面
    return null;
  }

  render() {
    return (
      <View>
        {this.renderAttendanceStatistics()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  // listview的样式
  attendanceListWrapper: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'white',

    // shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    marginHorizontal: 18,
    borderRadius: 10,
  },
  listView: {
    alignSelf: 'center',
    borderRadius: 10,
  },
  listItem: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 20,
  },
  rowItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  rowItemTimes: {
    flexDirection: 'row',
  },
  rowItemTimesTextF: {
    textAlign: 'center',
    color: '$color.mainColorLight',
    fontSize: 33,
  },
  rowItemTimesTextSBg: {
    justifyContent: 'flex-end',
    marginBottom: 7,
  },
  rowItemTimesTextS: {
    textAlign: 'center',
    color: '$color.mainColorLight',
    fontSize: 16,
  },
  rowItemTitle: {
    color: '#000000',
    fontSize: 12,
    textAlign: 'center',
  },
  bottomLineStyle: {
    width: 1,
    height: 70,
    backgroundColor: '#D9D9D9',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // 没有数据的样式
  noDataWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: device.width,
    height: device.height - 200,
  },
  nodataTitle: {
    fontSize: 16,
    color: '$color.mainTitleTextColor',
    marginTop: 30,
  },
  nodataSubTitle: {
    fontSize: 11,
    color: '$color.mainBodyTextColor',
    marginTop: 10,
  },
});
