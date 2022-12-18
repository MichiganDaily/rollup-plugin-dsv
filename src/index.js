import { extname } from "node:path";
import { URLSearchParams } from "node:url";

import { csvParse, tsvParse, dsvFormat, autoType as typer } from "d3-dsv";
import { createFilter } from "@rollup/pluginutils";

export default function plugin(options = {}) {
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

      let parser = csvParse;
      if (delimiter !== null) {
        if (delimiter === ",") {
          parser = csvParse;
        } else if (delimiter === "\t") {
          parser = tsvParse;
        } else {
          parser = dsvFormat(delimiter).parse;
        }
      } else if (ext === ".csv") {
        parser = csvParse;
      } else if (ext === ".tsv") {
        parser = tsvParse;
      }

      let data;
      if (autoType === null || autoType !== "false") {
        data = parser(src, typer);
      } else {
        data = parser(src);
      }

      if (columns !== null) {
        const cols = parser(columns).columns;
        if (cols === undefined) {
          console.warn(`The specified columns for ${fp} are undefined`);
        } else {
          const m = data.map((row) =>
            Object.fromEntries(cols.map((c) => [c, row[c]]))
          );
          m.columns = cols;
          data = m;
        }
      }

      return {
        code: `export default ${JSON.stringify(data)}`,
        map: null,
      };
    },
  };
}
