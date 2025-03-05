const fs = require('fs').promises;
const path = require('path');
const logFilePath = path.join(__dirname, 'backup_log.txt');

const log = async (type: string, backupName: string, params: any): Promise<void> => {
    let message = '';
    switch (type) {
        case 'success':
            message = `${backupName}: SUCCESS: Backup created at ${params.filepath}, HASH: ${params.hash}\n`;
            break;

        case 'error':
            message = `${backupName}: FAILED: tar command failed\n`;
            break;
    }

    if (message) {
        try {
            await fs.appendFile(logFilePath, message);
        } catch (err) {
            console.error('Error writing log to the directory:', err);
            throw err;
        }
    }
}

const backupExists = async (newHash: string): Promise<boolean> => {
    try {
        const result = await fs.readFile(logFilePath, 'utf8');
        return result.includes(`HASH: ${newHash}`);
    } catch (err) {
        console.error('Error reading directory:', err);
        throw err;
    }
}

export { log, backupExists };