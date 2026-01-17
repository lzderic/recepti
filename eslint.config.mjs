import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import preferArrow from "eslint-plugin-prefer-arrow";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      "prefer-arrow": preferArrow,
    },
    rules: {
      "prefer-arrow/prefer-arrow-functions": [
        "error",
        {
          disallowPrototype: true,
          singleReturnOnly: false,
          classPropertiesAllowed: false,
        },
      ],
    },
  },
  {
    files: ["src/store/**/*.ts"],
    rules: {
      "prefer-arrow/prefer-arrow-functions": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "storybook-static/**", "next-env.d.ts"]),
]);

export default eslintConfig;
