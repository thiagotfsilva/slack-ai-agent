import { App } from "@slack/bolt";
import dotenv from "dotenv";
import express from "express";
import pkg from '@slack/bolt';


dotenv.config();
const { App } = pkg;

const log = {
    info: (msg, ...args) => console.log(`[INFO] ${msg}`, ...args),
    error: (msg, ...args) => console.log(`[ERROR] ${msg}`, ...args),
    debug: (msg, ...args) => process.env.NODE_ENV === "development" && console.log(`[DEBUG] ${msg}`, ...args),
}

class SlackAIAgent {
    constructor() {
        this.app = express();
        this.slack = new App({
            token: process.env.SLACK_BOT_TOKEN,
            signingSecret: process.env.SLACK_SIGNING_SECRET,
            socketMode: true, 
            appToken: process.env.SLACK_APP_TOKEN,
        });
    }
}
