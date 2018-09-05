import { AsyncStorage } from "react-native"

class Hazards {

    keyPrefix() {
        return '@Hazards:'
    }

    key(id) {
        return this.keyPrefix() + id
    }

    async parseAndAddFromUrl(url) {
        url = url.replace('radar://s/', '')
        let parts = url.split('/')

        let types = {
            'e': 'Earthquake',
            'f': 'Fire',
            'typ': 'Typhoon',
            'tsu': 'Tsunami',
            'tro': 'Tropical Storm',
            'other': 'Other',
        }

        let hazard = {
            id: parts[0],
            name: parts[1],
            type: types[parts[2]],
            date: parts[3]
        }

        return this.addHazard(hazard.id, hazard)
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