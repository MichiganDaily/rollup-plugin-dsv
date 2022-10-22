# rollup-plugin-dsv

[DSV](https://en.wikipedia.org/wiki/Delimiter-separated_values) transformer for [Rollup](https://rollupjs.org) and [Vite](https://vitejs.dev/) using [d3-dsv](https://github.com/d3/d3-dsv).

## Usage

> This is a pure ESM module with no CommonJS build. You must set `"type": "module"` in your `package.json` to use this plugin.

1. Install by running `yarn add --dev michigandaily/rollup-plugin-dsv`.
2. Depending on whether you are using Rollup or Vite, add the plugin to your configuration:
   - In Rollup, import the plugin like the following:

     ```javascript
     // rollup.config.js
     import dsv from '@michigandaily/rollup-plugin-dsv';
  
     export default {
       plugins: [dsv()]
     };
     ```

   - In Vite, import the plugin like the following:

     ```javascript
     // vite.config.js
     import { defineConfig } from "vite";
     import dsv from "@michigandaily/rollup-plugin-dsv";
     
     export default defineConfig({
       plugins: [dsv()],
     });
     ```

3. You can optionally add an [`include` or `exclude`](https://github.com/rollup/plugins/tree/master/packages/pluginutils#createfilter) argument to the plugin in the configuration to specify which files you want to run the transformer on:

   ```javascript
   dsv({include: ["**.csv", "**.tsv", "**.dsv"]})
   ```

Now, you can import a CSV file like so:

```javascript
import data from "../data.csv"
```

You can also import a TSV file:

```javascript
import data from "../data.tsv"
```

If you have a file with a different type of delimiter,  you can import it with a `delimiter` query parameter. Consider a file with values delimited with colons. You can import it like so:

```javascript
import data from "../data.dsv?delimiter=:"
```

By default, this transformer will use [`d3.autoType`](https://github.com/d3/d3-dsv#autoType) to infer data types. If you want to disable automatic typing, import with a `autoType=false` query parameter:

```javascript
import data from "../data.csv?autoType=false"
```

If you want to only retrieve certain columns of values from a DSV, use the `columns` query paramter. The following import will only import the `a` and `b` columns from a CSV file:

```javascript
import data from "../data.csv?columns=a,b"
```
