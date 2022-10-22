import { extname } from "node:path";
import { URLSearchParams } from "node:url";

import { createFilter } from '@rollup/pluginutils';

export default function plugin(options = {}) {
  const csv = "csvParse";
  const tsv = "tsvParse";
  const dsv = "dsvFormat";
  const auto = "autoType";

  const filter = createFilter(options.include, options.exclude);

  return {
    name: "vite-plugin-dsv",
    transform(src, id) {
      const [fp, params] = id.split("?");
      if (!filter(fp)) {
        return null;
      }

      const ext = extname(fp);
      if (ext !== ".csv" && ext !== ".tsv" && ext !== ".dsv") {
        return null;
      }

      const q = new URLSearchParams(params);
      const delimiter = q.get("delimiter");
      const autoType = q.get("autoType");
      const columns = q.get("columns");

      let imports = "";

      let parser = csv;
      if (delimiter !== null) {
        if (delimiter === ",") {
          parser = csv;
        } else if (delimiter === "\t") {
          parser = tsv;
        } else {
          parser = `${dsv}("${delimiter}").parse`;
        }
      } else if (ext === ".csv") {
        parser = csv;
      } else if (ext === ".tsv") {
        parser = tsv;
      }

      if (parser === csv || parser === tsv) {
        imports += parser;
      } else {
        imports += dsv;
      }

      let data = `${parser}(\`${src}\`)`;
      if (autoType === null || autoType !== "false") {
        data = `${parser}(\`${src}\`, ${auto})`;
        imports += "," + auto;
      }

      if (columns !== null) {
        const mapper = `(d) => {
          const columns = ${parser}(\`${columns}\`).columns;
          if (columns === undefined) {
            console.warn("The specified columns for ${fp} are undefined");
            return d;
          }
          let m = d.map(r => Object.fromEntries(columns.map(c => [c, r[c]])));
          m.columns = columns;
          return m;
        }`;
        data = `(${mapper})(${data})`;
      }

      return {
        code: `import {${imports}} from "d3-dsv";export default ${data};`,
        map: null,
      };
    },
  };
}
