/** 出勤明显 */

import React from 'react';
import { ListView, ScrollView, Text, View } from 'react-native';
import NavBar from '@/common/components/NavBar';
import EStyleSheet from 'react-native-extended-stylesheet';
import Line from '@/common/components/Line';
import { device } from '@/common/Util';
import { punchDate } from '@/common/DateHelper';
import SectionBar from './SectionBar';

export default class AttendanceDetail extends React.Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: this.ds.cloneWithRows([]),
    };
  }

  /** Life cycle */

  componentDidMount() {
    const { attendanceDetailData } = this.props.passProps;
    this.setState({ dataSource: this.ds.cloneWithRows(attendanceDetailData)});
  }
  
  /** Render methods */

  render() {
    const { navigator } = this.props;
    const { dataSource } = this.state;

    return (
      <View style={[styles.flex, styles.container]}>
        <NavBar
          title="明细"
          onPressLeftButton={() => navigator.pop()}
        />
        <View style={[styles.flex, { paddingTop: 10 }]}>
          <SectionBar title1="日期" title2="出勤名称" title3="数量"/>
          <ListView
            dataSource={dataSource}
            renderRow={(rowData, sectionID, rowID, highlightRow) => this.renderRow(rowData, sectionID, rowID, highlightRow)}
            bounces={false}
            renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
          />
        </View>
      </View>
    );
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
    const date = rowData.TIMECARDDATE ? punchDate(rowData.TIMECARDDATE) : '';
    const name = rowData.CLASSNAME ? rowData.CLASSNAME : '';
    const count = rowData.PAYHOURS;

    return (
      <View style={styles.row}>
        <View style={styles.title1}>
          <Text
            style={[styles.font, styles.font1]}
            numberOfLines={1}
            allowFontScaling={false}
          >{date}</Text>
        </View>
        <View style={styles.title2}>
          <Text
            style={[styles.font, styles.font2]}
            numberOfLines={1}
            allowFontScaling={false}
          >{name}</Text>
        </View>
        <View style={styles.title3}>
          <Text
            style={[styles.font, styles.font3]}
            numberOfLines={1}
            allowFontScaling={false}
          >{`${count}`}</Text>
        </View>
      </View>
    );
  }

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return <Line/>
  }
}

const styles = EStyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    backgroundColor: '$color.containerBackground',
  },
  row: {
    width: device.width,
    height: 36.5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  font: {
    fontSize: 14,
    color: '#333333',
  },
  title1: {
    flex: 1,
  },
  title2: {
    flex: 1,
  },
  title3: {
    flex: 1,
  },
  font1: {
    marginLeft: 18,
  },
  font2: {
    textAlign: 'center',
  },
  font3: {
    textAlign: 'right',
    marginRight: 23.5,
  },
});