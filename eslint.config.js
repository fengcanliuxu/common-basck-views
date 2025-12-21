import eslint from "eslint"
import globals from "globals"
import tseslint from 'typescript-eslint'
import eslintPluginVue from 'eslint-plugin-vue'
export default [{
    ignores: [
        "node_modules",
        "dist",
        "public"
    ]},
    eslint.configs.recommended,
    ...eslintPluginVue.configs['flat/essential'],
    {
        languageOptions: {
            globals: globals.browser
        }
    },
    {
        files:["**/*.vue"],
        languageOptions:{
            parserOption:{
                parser:tseslint.parser,
                ecmaVersion:'latest',
                ecmaFeatures:{
                    jsx:true
                }
            }
        },
        rules:{
            'vue/no-mutating-props':[
                'error',
                {
                    shallowOnly:true
                }
            ]
        }
    }
]