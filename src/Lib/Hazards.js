import { AsyncStorage } from "react-native"

const HAZARD_TYPES = {
    'e': 'Earthquake',
    'f': 'Fire',
    'typ': 'Typhoon',
    'tsu': 'Tsunami',
    'tro': 'Tropical Storm',
    'other': 'Other',
}

class Hazards {

    keyPrefix() {
        return '@Hazards:'
    }

    key(id) {
        return this.keyPrefix() + id
    }

    async parseAndAddFromUrl(url) {
        let [id, name, type, date] = url
            .replace('http://rdr.app/', '')
            .split('/')
            .map(part => decodeURIComponent(part))

        type = HAZARD_TYPES[type]
        return this.addHazard(id, { id, name, type, date })
    }

    async addHazard(id, data) {
        await AsyncStorage.setItem(
            this.key(id),
            JSON.stringify(data)
        )
        return data
    }

    async allHazards() {
        
        const keys = await AsyncStorage.getAllKeys()
        const hazardKeys = keys.filter(key => key.indexOf(this.keyPrefix()) >= 0)

        return Promise.all(hazardKeys.map(async key => {
            const item = await AsyncStorage.getItem(key)
            return JSON.parse(item)
        }))
    }
}


export default new Hazards()