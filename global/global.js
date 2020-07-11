const globalVariables = {
    siteName: 'Transmister',
    appName: 'Transmister',
    prodName: 'Transmister',
}

const globalStyleVariables = {
    color: {
        blue: {
            theme: {
                1: "#0083ff",
                2: "#4ea9ff",
                3: "#65b4ff",
                4: "#85c4ff",
                text: {
                    1: "#f0f8ff",
                    2: "#d1e9ff",
                    3: "#acd7ff"
                }
            }
        },
        background: {
            white: "#ffffff",
            black: {
                text: {
                    1: "#191e22",
                    2: "#9ea8b1"
                }
            }
        }
    },
    borderRadius: {
        1: "4px",
        2: "8px"
    }
}

import { createTheme } from '@fluentui/react'

const globalFluentUiStyleVariables = createTheme({
    palette: {
        themePrimary: '#0083ff',
        themeLighterAlt: '#00050a',
        themeLighter: '#001529',
        themeLight: '#00284d',
        themeTertiary: '#004f99',
        themeSecondary: '#0074e0',
        themeDarkAlt: '#1990ff',
        themeDark: '#3da1ff',
        themeDarker: '#70baff',
        neutralLighterAlt: '#ffffff',
        neutralLighter: '#ffffff',
        neutralLight: '#ffffff',
        neutralQuaternaryAlt: '#ffffff',
        neutralQuaternary: '#ffffff',
        neutralTertiaryAlt: '#ffffff',
        neutralTertiary: '#080a0b',
        neutralSecondary: '#0b0d0f',
        neutralPrimaryAlt: '#0e1013',
        neutralPrimary: '#191e22',
        neutralDark: '#13171a',
        black: '#161a1e',
        white: '#ffffff',
    }
});

export default globalVariables
export { globalVariables, globalStyleVariables, globalFluentUiStyleVariables }