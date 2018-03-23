import React, {Component} from 'react';
import Images from "../Constants/Images";
import {Image, StyleSheet} from 'react-native';

class PortalLogo extends Component
{
    render() {
        return <Image source={Images.logo()} defaultSource={Images.ssas} style={styles.logo} />;
    }
}

const styles = StyleSheet.create({
  logo: {
    width: 90,
    height: 90,
    marginTop: 8
  }
});

export default PortalLogo