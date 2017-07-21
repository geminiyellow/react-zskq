import React, { PureComponent } from 'react';
import {
  DeviceEventEmitter,
  InteractionManager,
  ListView,
  View,
} from 'react-native';
import I18n from 'react-native-i18n';

import { device, keys } from '@/common/Util';
import Line from '@/common/components/Line';
import Style from '@/common/Style';
import { updateUserLanguage } from '@/common/api';
import { POST } from '@/common/Request';
import { sessionId, messageType } from '@/common/Consts';
import { showMessage } from '@/common/Message';
import NavBar from '@/common/components/NavBar';
import Image from '@/common/components/CustomImage';
import TouchableHighlight from '@/common/components/CustomTouchableHighlight';
import Text from '@/common/components/TextField';
import { lan, helloType, languages, languageType } from '@/common/LanguageSettingData';
import realm from '@/realm';
import UmengAnalysis from '@/common/components/UmengAnalysis';
import styles from './languageSettingStyle';

let selectedIndexOriginal;
let canSendPostToServer = true;
let lanServerMobile = [];
let lanTemp = [];

export default class ServiceAgreement extends PureComponent {

  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });
    this.state = {
      dataSource: this.dataSource,
      helloWord: I18n.t('mobile.module.language.hello'),
    };
    lan.map(item => {
      const temp = {};
      for (const k in item) {
        temp[k] = item[k];
      }
      lanTemp.push(temp);
      return true;
    });
  }

  /** life cycle */

  componentWillMount() {
    UmengAnalysis.onPageBegin('LanguageSetting');
    const configLan = realm.objects('Config').filtered('name="language"');
    lanServerMobile.push(lanTemp[0]);
    global.companyResponseData.language.map(item => {
      lanTemp.map(lae => {
        if (item.code == lae.code) {
          lae.language = item.name;
          lanServerMobile.push(lae);
        }
        return true;
      });
      return true;
    });
    if (configLan.length != 0 && configLan[0].value != '0') {
      lanServerMobile.map(item => {
        item.selected = false;
        if (item.code == 'Automatic') { item.selected = true; }
        if (item.code == languages[parseInt(configLan[0].value) - 1]) {
          item.selected = true;
          lanServerMobile[0].selected = false;
        }
        return true;
      });
    }
    selectedIndexOriginal = lanTemp.indexOf(lanServerMobile.find(item => item.selected));
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(lanServerMobile),
    });
  }

  componentWillUnmount() {
    UmengAnalysis.onPageEnd('LanguageSetting');
    lanServerMobile = [];
    lanTemp = [];
  }

  /** response event */

  onPressDoneButton() {
    const selectedIndex = lanTemp.indexOf(lanServerMobile.find(item => item.selected));
    if (selectedIndexOriginal == selectedIndex) {
      this.props.navigator.pop();
      return;
    }

    let languageIndex;
    if (selectedIndex == 0) {
      const k = languageType.indexOf(device.mobileLocale);
      if (k == -1) {
        languageIndex = 1;
      } else {
        languageIndex = k;
      }
    } else {
      languageIndex = selectedIndex - 1;
    }
    const params = {};
    params.sessionId = sessionId;
    params.language = languages[languageIndex];

    if (canSendPostToServer) {
      POST(updateUserLanguage(), params, (responseData) => {
        if (responseData.successCode == 0) {
          I18n.locale = languageType[languageIndex];
          realm.write(() => {
            const language = realm.objects('Config').filtered('name="language"');
            if (language.length == 0) {
              realm.create('Config', { name: 'language', value: `${selectedIndex}` });
            } else {
              language[0].value = `${selectedIndex}`;
            }
          });

          DeviceEventEmitter.emit('changeLanguage', selectedIndex);
          this.props.navigator.pop();
          InteractionManager.runAfterInteractions(() => {
            canSendPostToServer = true;
          });
        }
      }, (message) => {
        canSendPostToServer = true;
        showMessage(messageType.error, message);
      });
    }
    canSendPostToServer = false;
  }

  onPressRow(rowID) {
    lanServerMobile.map(item => item.selected = false);
    lanServerMobile[rowID].selected = true;
    let selectedIndex = 0;
    if (rowID == 0) {
      const k = languageType.indexOf(device.mobileLocale);
      if (k == -1) {
        selectedIndex = 2;
      } else {
        selectedIndex = k + 1;
      }
    } else {
      selectedIndex = languages.indexOf(lanServerMobile[rowID].code) + 1;
    }
    this.setState({
      dataSource: this.dataSource.cloneWithRows(lanServerMobile),
      helloWord: helloType[selectedIndex - 1],
    });
  }

  /** render methods */

  renderSeparator(sectionID, rowID) {
    const lastRow = rowID == (this.state.dataSource.getRowCount() - 1);
    if (lastRow) {
      return (
        <Line key={`${sectionID}-${rowID}`} />
      );
    }

    return (
      <View key={`${sectionID}-${rowID}`} style={{ backgroundColor: Style.color.white }}>
        <Line style={[!lastRow && styles.separator, { backgroundColor: '#EBEBEB' }]} />
      </View>
    );
  }

  renderRow(language, sectionID, rowID) {
    if (rowID == 0) {
      return (
        <View key={`${sectionID}-${rowID}`} style={{ flexDirection: 'column' }}>
          <TouchableHighlight onPress={() => this.onPressRow(rowID)}>
            <View style={styles.languageItem}>
              <Text style={{ flexGrow: 1, marginLeft: 18, fontSize: 18 }}>{I18n.t(language.language)}</Text>
              {this.renderCheckboxIcon(rowID)}
            </View>
          </TouchableHighlight>
        </View>
      );
    }

    return (
      <View key={`${sectionID}-${rowID}`} style={{ flexDirection: 'column' }}>
        <TouchableHighlight onPress={() => this.onPressRow(rowID)}>
          <View style={styles.languageItem}>
            <Text style={{ flexGrow: 1, marginLeft: 18, fontSize: 18 }}>{language.language}</Text>
            {this.renderCheckboxIcon(rowID)}
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  renderCheckboxIcon(rowID) {
    if (lanServerMobile[rowID].selected) {
      return (
        <Image style={styles.checkBoxIcon} source={{ uri: 'checkbox_selected' }} />
      );
    }
    return <Image style={styles.checkBoxIcon} source={{ uri: 'checkbox_common' }} />;
  }

  render() {
    const { helloWord, dataSource } = this.state;
    return (
      <View style={styles.container}>
        <NavBar
          title={I18n.t('mobile.module.language.setting')}
          onPressLeftButton={() => this.props.navigator.pop()}
          rightContainerLeftButtonTitle={I18n.t('mobile.module.language.done')}
          onPressRightContainerLeftButton={() => this.onPressDoneButton()} />
        <Line style={{ marginTop: 10 }} />
        <View style={styles.helloView}>
          <Text style={styles.helloText}>{helloWord}</Text>
        </View>
        <Line />

        <View style={styles.bar}>
          <Text style={styles.barTitleText}>{I18n.t('mobile.module.language.setting')}</Text>
        </View>
        <Line style={{ marginTop: 0 }} />

        <Line />
        <ListView
          style={{ flex: 1 }}
          removeClippedSubviews={false}
          bounces={false}
          dataSource={dataSource}
          renderSeparator={(sectionID, rowID) => this.renderSeparator(sectionID, rowID)}
          renderRow={(language, sectionID, rowID) => this.renderRow(language, sectionID, rowID)}
        />
      </View>
    );
  }
}
