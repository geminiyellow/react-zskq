// SearchBar

import React, { Component } from 'react';
import { DeviceEventEmitter, View, Text, TouchableOpacity, TextInput } from 'react-native';
import Image from '@/common/components/CustomImage';
import I18n from 'react-native-i18n';
import Line from '@/common/components/Line';
import styles from './SearchBar.style';

const searchCodeImage = 'search_code';

export default class SearchBar extends Component {
  mixins: [React.addons.PureRenderMixin]

  constructor(props) {
    super(props);
    this.state = { value: '' };
  }

  /** life cycle */

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('onPressHistoryData', (text) => {
      this.onSubmitEditing(text);
    });
  }

  componentWillUnmount() {
    this.listener.remove();
  }

  /** callback */

  onChangeTextEvent(text) {
    const { searchCode } = this.props;
    this.setState({ value: text });
    searchCode(text);
  }

  onSubmitEditing(text) {
    this.setState({ value: text });
    this.props.onSubmitSearchAction(text);
  }

  /** render method */

  render() {
    const { navigator } = this.props;
    const { value } = this.state;

    return (
      <View>
        <View style={styles.container}>
          <View style={styles.bar}>
            <Image style={styles.image} source={{ uri: searchCodeImage }} />
            <TextInput
              style={styles.textInput}
              placeholder={I18n.t('mobile.module.onbusiness.searchbarplaceholdertext')}
              placeholderTextColor="#999999"
              value={value}
              onChange={(event) => this.onChangeTextEvent(event.nativeEvent.text)}
              onSubmitEditing={(event) => this.onSubmitEditing(event.nativeEvent.text)}
              maxLength={50}
              returnKeyType="search"
              clearButtonMode="always"
              underlineColorAndroid="transparent"
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={() => navigator.pop()}>
            <Text allowFontScaling={false} style={styles.buttonText}>{I18n.t('mobile.module.onbusiness.cancelbuttontext')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.lineBackground}>
          <Line style={styles.line} />
        </View>
      </View>
    );
  }
}