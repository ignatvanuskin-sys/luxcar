/** Registers the TypeScript alias loader before a test module is imported. */
import { register } from "node:module";

register("./ts-alias-loader.mjs", import.meta.url);
