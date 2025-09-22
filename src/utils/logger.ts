import winston from "winston";
import config from "../config";

const logger = winston.createLogger({
  level: config.logLevel || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
