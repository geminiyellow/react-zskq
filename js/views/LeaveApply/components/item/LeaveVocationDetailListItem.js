import { ListView, View } from 'react-native';
import React, { PureComponent } from 'react';

import EStyleSheet from 'react-native-extended-stylesheet';
import { getYYYYMMDDFormat } from '@/common/Functions';
import CustomizedCompanyHelper from '@/common/CustomizedCompanyHelper';
const customizedCompanyHelper = new CustomizedCompanyHelper();

import I18n from 'react-native-i18n';
import { device } from '@/common/Util';
import Line from '@/common/components/Line';
import Text from '@/common/components/TextField';
import ProgressBar from '@/common/components/ProgressBar';


export default class LeaveVocationDetailListItem extends PureComponent {

  // 初始化
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }

  componentDidMount() {
    const dataSources = this.props.dataSources;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(dataSources),
    });
  }

  onSetCreaditsItemData(rowData, sectionID, rowID) {
    let total = 0;
    const companyCode = customizedCompanyHelper.getCompanyCode().toLowerCase();
    if ( companyCode === 'gant' || companyCode === 'samsung') {
      total = parseFloat(rowData.creaditRemain) + parseFloat(rowData.creaditUsed);
    } else {
      total = parseFloat(rowData.creaditTotal) + parseFloat(rowData.LASTYEARREMAINDAYS);
    }
    const remain = parseFloat(rowData.creaditRemain);
    let used = parseFloat(rowData.creaditUsed);
    let progress = 0;
    if (total != 0) {
      progress = parseFloat(((remain * 100) / (total * 100)).toFixed(2));
    }
    if (progress >= 0.95) {
      used = 0;
    }
    const effectiveDate = getYYYYMMDDFormat(rowData.effectiveDate);
    const expDate = getYYYYMMDDFormat(rowData.expDate);
    let titleName = '';
    if (rowData.effectiveYear != '0') {
      titleName = `${rowData.effectiveYear}${I18n.t('mobile.module.leaveapply.leaveapplycreaditsyear')}`;
    } else {
      titleName = rowData.creaditName;
    }
    if (this.state.dataSource.getRowCount() === 1) {
      return (
        <View key={`${this.state.sectionID}-${this.state.rowID}`}>
          <Line height={0.25} />
          {this.onRenderItem(titleName, effectiveDate, expDate, remain, used, progress)}
          <Line height={0.5} />
        </View>
      );
    } else {
      if (parseInt(rowID) % 2 === 0) {
        if (`${this.state.dataSource.getRowCount()}` === `${parseInt(rowID) + 1}`) {
          return (
            <View key={`${this.state.sectionID}-${this.state.rowID}`}>
              <Line height={0.25} />
              {this.onRenderItem(titleName, effectiveDate, expDate, remain, used, progress)}
              <Line height={0.5} />
            </View>
          );
        } else {
          return (
            <View key={`${this.state.sectionID}-${this.state.rowID}`}>
              <Line height={0.25} />
              {this.onRenderItem(titleName, effectiveDate, expDate, remain, used, progress)}
            </View>
          );
        }
      } else {
        if (`${this.state.dataSource.getRowCount()}` === `${parseInt(rowID) + 1}`) {
          return (
            <View key={`${this.state.sectionID}-${this.state.rowID}`}>
              <Line height={0.25} />
              {this.onRenderItem(titleName, effectiveDate, expDate, remain, used, progress)}
              <Line height={0.5} />
            </View>
          );
        } else {
          return (
            <View key={`${this.state.sectionID}-${this.state.rowID}`}>
              <Line height={0.5} />
              {this.onRenderItem(titleName, effectiveDate, expDate, remain, used, progress)}
            </View>
          );
        }
      }
    }
  }

  onRenderItem(titleName, effectiveDate, expDate, remain, used, progress) {
    return (
      <View style={styles.container}>
        <View style={styles.titleContentStyle}>
          <Text style={styles.titleNameStyle} numberOfLines={1}>{titleName}</Text>
          <Text style={styles.titleDetailStyle} numberOfLines={1}>{`${I18n.t('mobile.module.leaveapply.leaveapplycreaditsyxq')}${effectiveDate}${I18n.t('mobile.module.leaveapply.leaveapplycreaditsz')}${expDate}`}</Text>
        </View>
        <View style={styles.progressBarStyle}>
          <ProgressBar
            widthSecond={progress} spacing={36} height={16} />
          <View style={[styles.progressBarTextStyle, {top: device.isAndroid ? -1.8 : -0.3}]}>
            <Text style={[styles.progressBarTextRemainStyle, { width: (device.width - 36) * progress, textAlign: 'center' }]}>{remain}</Text>
            <Text style={[styles.progressBarTextUsedStyle, { width: (device.width - 36) * (1 - progress), textAlign: 'center' }]}>{used}</Text>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <ListView
        bounces={false}
        removeClippedSubviews={false}
        dataSource={this.state.dataSource}
        renderRow={(rowData, sectionID, rowID) => this.onSetCreaditsItemData(rowData, sectionID, rowID)}
      />
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flexGrow: 1,
    height: 100,
    width: device.width,
    backgroundColor: '#ffffff',
  },
  titleContentStyle: {
    flexGrow: 1,
    marginLeft: 18,
    marginRight: 18,
  },
  titleNameStyle: {
    flexGrow: 1,
    height: 16,
    color: '#333333',
    fontSize: 13.5,
    marginTop: 12,
    fontWeight: 'bold',
  },
  titleDetailStyle: {
    flexGrow: 1,
    height: 20,
    color: '#333333',
    fontSize: 13.5,
    marginTop: 12,
    textAlign: 'left',
  },
  progressBarStyle: {
    marginLeft: 18,
    marginRight: 18,
    marginTop: 16,
    marginBottom: 16,
  },
  progressBarTextStyle: {
    flexGrow: 1,
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  progressBarTextRemainStyle: {
    flexDirection: 'row',
    color: '#ffffff',
    height: 16,
  },
  progressBarTextUsedStyle: {
    flexDirection: 'row',
    height: 16,
    color: '#000000',
  },
});