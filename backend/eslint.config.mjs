import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jsdoc from 'eslint-plugin-jsdoc';
import standard from 'eslint-config-standard'

export default [

  jsdoc.configs['flat/recommended'],
  {
    files: ["**/*.js"],
    ignores: ['docs'],
    plugins: {
      jsdoc,
      standard,
    },
    rules: {
      'jsdoc/require-description': 'warn',
      "jsdoc/check-tag-names": ["error", { "definedTags": ["consumes", "produces", "route", "Socket"] }],
      "no-unused-vars": "off"
    },
    settings: {
      jsdoc: {
        tagNamePreference: {
          augments: 'extends',
          class: 'constructor'
        }
      }
    },
    languageOptions: { sourceType: "commonjs" }
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
];