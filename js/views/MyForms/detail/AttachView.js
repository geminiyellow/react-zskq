/**
 * 表单详情附件列表控件
 */
import { ListView, TouchableOpacity, View } from 'react-native';
import React, { PureComponent } from 'react';
import _ from 'lodash';
import Text from '@/common/components/TextField';
import Image from '@/common/components/CustomImage';
import { device } from '@/common/Util';
import I18n from 'react-native-i18n';
import FormDetailStyle from '../FormDetailStyle';
import PreViewImageUi from './PreViewImageUi';

let detail = null;
export default class AttachView extends PureComponent {
  constructor(...args) {
    super(...args);
    this.list = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      extend: false,
    };
  }
  componentWillMount() {
    detail = this.props.detail;
  }

  // 获取附件
  getAttachViews = () => {
    if (detail) {
      const urls = [...detail.formDetail.AttachmentUrl];
      return (
        <ListView
          ref={listview => this.imgs = listview}
          dataSource={this.list.cloneWithRows(urls)}
          removeClippedSubviews={false}
          enableEmptySections
          style={{ alignSelf: 'center' }}
          contentContainerStyle={FormDetailStyle.attListStyle}
          showsVerticalScrollIndicator={false}
          renderRow={(rowData, sectionID, rowID, highlightRow) => this.inflateImg(rowData, sectionID, rowID, highlightRow)}
        />
      );
    }
    return null;
  }

  inflateImg(rowData, sectionID, rowID, highlightRow) {
    return (
      <TouchableOpacity key={`${sectionID}-${rowID}`} onPress={() => this.preViewImg(rowData)} style={{ height: 70, alignItems: 'center', justifyContent: 'center' }}>
        <Image style={{ width: 60, height: 60, marginRight: 4, resizeMode: Image.resizeMode.cover }} source={{ uri: rowData }} />
      </TouchableOpacity>
    );
  }

  preViewImg(url) {
    this.props.navigator.push({
      component: PreViewImageUi,
      passProps: {
        Url: url,
        Navigator: this.props.navigator,
      },
    });
  }

  render() {
    return (
      <View style={[FormDetailStyle.rowTagStyle, { backgroundColor: '#fff', flexDirection: 'column' }, { paddingLeft: 12, paddingRight: 12 }]}>
        <Text style={FormDetailStyle.rowTagTitleStyle}>{I18n.t('mobile.module.verify.leave.attach')}</Text>
        <View style={{ flexDirection: 'row', marginTop: 9, flex: 1 }}>
          {this.getAttachViews()}
        </View>
      </View>
    );
  }

}