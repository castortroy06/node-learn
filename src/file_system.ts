const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');


interface Directories {
    sourceDirectory: string;
    destinationDirectory: string;
}

const validate = async (args: any): Promise<Directories> => {
    try {
        if (args.length !== 2) { // Assuming args is an array, not process.argv directly.
            throw new Error(`Expected 2 input parameters, but got ${args.length}.`);
        }

        const sourceDirectory = path.isAbsolute(args[0]) ? args[0] : path.join(__dirname, args[0]);
        const destinationDirectory = path.isAbsolute(args[1]) ? args[1] : path.join(__dirname, args[1]);

        if (destinationDirectory.includes(sourceDirectory)) {
            throw new Error("Source directory shouldn't match or be inside of destination directory.");
        }

        return { sourceDirectory, destinationDirectory };
    } catch (err) {
        console.error('Error reading directory:', err);
        throw err;  // This will reject the promise returned by the async function.
    }
};

const generateBackupFileName = function (): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    const filename = `backup-${year}-${month}-${day}T${hours}-${minutes}-${seconds}-${milliseconds}Z`;
    return filename;
}

const readSourceDir = async (source: string): Promise<string[]> => {
    try {
        const files = await fs.readdir(source);
        return files;
    } catch (err) {
        console.error('Error reading directory:', err);
        throw err;
    }
};

const createBackup = async (sourceDir: string, backupFileDirectory: string, backupFileName: string, backupExists: boolean): Promise<boolean | string> => {
    return new Promise((resolve, reject) => {
        if (backupExists) {
            reject(new Error('Backup of this directory already exists.'));
            return;
        }

        const backupFilePath = path.join(backupFileDirectory, `${backupFileName}.tar.gz`);
        const command = `tar -czf ${backupFilePath} -C ${sourceDir} .`;
        exec(command, (error: any, stdout: any, stderr: any) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                reject(new Error(stderr));
                return;
            }
            resolve(backupFilePath);
        });
    });
}

export { validate, readSourceDir, createBackup, generateBackupFileName };
