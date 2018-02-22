import React, { Component } from "react";
import { WebView } from "react-native";
import RNFS from "react-native-fs";

class Upload extends Component {
  render() {
    const basePath = "file://" + RNFS.MainBundlePath + "/www";
    const path = basePath + "/submissions.html";

    const source = {
      uri: path,
      baseUri: basePath
    };

    return <WebView source={source} />;
  }
}

export default Upload;
