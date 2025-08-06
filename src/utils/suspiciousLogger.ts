import fs from "fs";
import path from "path";
import { PATH_LOGS } from '@constants/envData';

const logFilePath = path.join(PATH_LOGS, "suspicious_slugs.log");

export const logSuspiciousSlug = (ip: string, slug: string): void => {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] IP: ${ip} | Suspicious slug: "${slug}"\n`;

    fs.appendFile(logFilePath, logLine, () => {
    });
    console.log(`[SUSPICIOUS SLUG BLOCKED] IP: ${ip}, SLUG: ${slug}`);
};
