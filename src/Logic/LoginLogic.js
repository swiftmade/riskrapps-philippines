import Api from '../Lib/Api'
import Session from "../Lib/Session";
import UpdateLogic from './UpdateLogic';

class LoginLogic {

    async handle(domain) {
        Api.setDomain(domain)
        const session = await Api.meta()
        session.domain = domain
        await Session.set(session)

        try {
            await UpdateLogic.handle()
        } catch (error) {
            Session.destroy()
            throw error
        }
    }
}

export default new LoginLogic