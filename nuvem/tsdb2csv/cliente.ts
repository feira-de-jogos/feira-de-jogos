import * as fs from "fs";
import { InfluxDB } from "@influxdata/influxdb-client";
import { config } from "dotenv";

config();

const token = process.env.INFLUX_TOKEN ?? "";
const url = process.env.INFLUX_URL ?? "https://tsdb.feira-de-jogos.dev.br";
const org = process.env.INFLUX_ORG ?? "feira";
const file = process.env.OUTPUT_FILE ?? "output.csv";

const client = new InfluxDB({ url, token });
const queryClient = client.getQueryApi(org);

const fluxQuery = `from(bucket: "feira")
  |> range(start: -365d)`;
  // |> filter(fn: (r) => r._field =~ /temp/)
  // |> filter(fn: (r) => r.v == "0")`;

let count = 0;
fs.writeFileSync(file, "");

queryClient.queryRows(fluxQuery, {
  next: (row, tableMeta) => {
    const tableObject = tableMeta.toObject(row);
    if (count === 0) {
      fs.appendFileSync(file, `${Object.keys(tableObject).join(",")}\n`);
    }
    fs.appendFileSync(file, `${Object.values(tableObject).join(",")}\n`);
    count++;
  },
  error: (error: Error) => {
    console.error("\nError:", error);
  },
  complete: () => {
    console.log(`\nSuccess: ${count} lines written to ${file}.`);
  },
});
