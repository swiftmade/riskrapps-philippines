import { MessageBarManager } from "react-native-message-bar"

const show = (alertType, title, message) => {
    MessageBarManager.showAlert({
      title,
      message,
      alertType,
      viewTopInset: 15 // Default is 0
    });
}

export default {
    error(title, message) {
        return show('error', title, message)
    }
}