import { cpSync, mkdirSync } from "fs";

// EDIT paths for your project structure:
const anchorDir = "../notes/target";
const frontendDir = "../frontend/src";
const programName = "notes"
mkdirSync(`${frontendDir}/lib/idl`, { recursive: true });

cpSync(`${anchorDir}/idl/${programName}.json`, `${frontendDir}/lib/idl/${programName}.json`);
cpSync(`${anchorDir}/types/${programName}.ts`, `${frontendDir}/lib/idl/${programName}.ts`);

console.log("IDL + types copied successfully!");
