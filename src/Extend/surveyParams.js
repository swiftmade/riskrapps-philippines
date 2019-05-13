import Files from "ssas-app-core/src/Lib/Files"
import Session from "ssas-app-core/src/Lib/Session"

export default (params, props) => {

  const {hazard} = props.navigation.state.params

  return {
    ...params,
    mode: "offline",
    
    /**
     * Submission Settings
     */
    instant_submit: 1,
    sms: '+14708008918',
    auth: Session.get('auth.token'),
    submit: Session.get("settings.url") + "/openrosa/submissions",

    /**
     * Survey/session settings
     */
    jumpto: "off",
    survey: Files.surveyJson(),
    db: Session.get("domain"),
    bg: Session.bgPath(),
    session: `${hazard.type} ${hazard.name}`,
    session_extra: JSON.stringify({
      uid: Session.get('auth.id'),
      hid: hazard.id,
    }),
  }
}