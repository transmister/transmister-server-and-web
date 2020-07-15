var string = {
    'en-US': require('./en-US'),
    'zh-CN': require('./zh-CN')
}

// var languageCode = navigator.language || navigator.userLanguage
var languageCode = 'zh-CN'

languageString = string[languageCode]

export default languageString