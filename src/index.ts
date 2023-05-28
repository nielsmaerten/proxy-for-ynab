#!/usr/bin/env node
import { messages } from "./constants";
import * as cli from "./lib/cli";
import { getConfiguration } from "./lib/configuration";
import { exportCsv, findBankFiles, cleanup } from "./lib/filesystem";
import { parseBankFile } from "./lib/parser";
import { upload } from "./lib/uploader";
import { BankFile } from "./types";
import { collectStats } from "./lib/stats";
import fs from "fs";

(async () => {
  // Ensure the tool has a valid configuration
  const config = getConfiguration();

  // Exit if the config file is not set up yet
  const isFirstRun = !config.configurationDone;
  if (!config.configurationDone) return cli.exitApp();

  // Display welcome message and collect stats (if allowed)
  const statsPromise = collectStats(config);
  cli.displayWelcomeMessage(isFirstRun);

  // Confirm folder where the tool should look for bank files
  const importPathExists =
    config.importPath && fs.existsSync(config.importPath);
  if (!config.skipPathConfirmation || !importPathExists) {
    config.importPath = await cli.confirmImportPath(config.importPath);
  }

  // Find files eligible for conversion in the importPath
  const bankFiles = findBankFiles(config.importPath!, config);
  console.log(messages.filesFound, bankFiles.length);

  // Parse and convert bankFiles
  const doParsing = (bf: BankFile) => parseBankFile(bf, config.parsers);
  const parsedFiles = bankFiles.map(doParsing);

  // Save parsed files, delete original files
  parsedFiles.forEach(exportCsv);
  parsedFiles.forEach(cleanup);

  // Upload to YNAB
  console.log("");
  const uploads = parsedFiles.map((parsedFile) => upload(parsedFile, config));
  await Promise.all(uploads);

  // All done!
  cli.displayGoodbyeMessage();
  await statsPromise;
  return cli.exitApp();
})().catch(handleError);

function handleError(err: any) {
  console.error("Unhandled error: exiting.");

  const isVerbose = process.argv.find((arg) => arg.toLowerCase() === "-v");
  if (isVerbose) console.error(JSON.stringify(err));
  else console.log("For details, run with flag `-v`");

  return cli.exitApp();
}
