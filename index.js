import dotenv from "dotenv";

dotenv.config();

const log = {
    info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
    error: (msg, ...args) => console.log(`[ERROR] ${msg}`, ...args),
    debug: (msg, ...args) => process.env.NODE_ENV === "development" && console.log(`[DEBUG] ${msg}`, ...args),
}

log.info("Hello, world!");
