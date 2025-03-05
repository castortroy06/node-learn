import { calculateDirectoryChecksum } from "./crypto";
import { readSourceDir, createBackup, generateBackupFileName, validate } from "./file_system";
import { backupExists, log } from "./logs";

const args = process.argv.slice(2);

let checksum = '';
let backupName = '';
let sourceDirectory = '';
let destinationDirectory = '';

validate(args).then(result => {
    sourceDirectory = result.sourceDirectory;
    destinationDirectory = result.destinationDirectory;
    return readSourceDir(sourceDirectory);
}).then(files => {
    const hash = files.join('');
    return calculateDirectoryChecksum(hash);
}).then(directoryChecksum => {
    checksum = directoryChecksum;
    return backupExists(directoryChecksum);
}).then(backupExists => {
    backupName = generateBackupFileName();
    return createBackup(sourceDirectory, destinationDirectory, backupName, backupExists);
}).then(backupFilepath => {
    if (backupFilepath) {
        log('success', backupName, { hash: checksum, filepath: backupFilepath });
    }
}).catch(error => {
    console.error('Error:', error);
    log('error', backupName, {});
});

