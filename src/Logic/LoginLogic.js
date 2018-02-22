import Api from '../Lib/Api'
import Session from "../Lib/Session";

class LoginLogic {

    async handle(domain) {
        Api.setDomain(domain)
        const session = await Api.connect()
        await Session.set(session)
    }
}

export default new LoginLogic