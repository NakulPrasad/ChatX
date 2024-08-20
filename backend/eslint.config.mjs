import globals from "globals";
import pluginJs from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";


export default [
  {
    files: ["**/*.js"], languageOptions: { sourceType: "commonjs" }
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  { ignores: ["build/*"] },
  {
    "plugins": {
      jsdoc: jsdoc
    },
    "extends": ["plugin:jsdoc/recommended"]
  }

];