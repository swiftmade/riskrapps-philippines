import Colors from './Colors'

export default {
    default: {
        background: null,
        buttonStyles: {
            primary: {
                text: '#fff',
                background: Colors.darkGreen,
            },
            secondary: {
                text: '#fff',
                background: Colors.lightBlue,
            },
            other: {
                text: Colors.textColor,
                background: Colors.lightGrey,
            },            
        },
    },
    philippines: {
        background: require('../Assets/philippines.png'),
        buttonStyles: {
            primary: {
                text: '#fff',
                background: '#FF9900'
            },
            secondary: {
                text: '#fff',
                background: '#0266CC'
            },
            other: {
                text: '#5A5A5A',
                background: '#D7D7D7',
            },
        },
    },
}