import * as crypto from 'crypto';

export const calculateDirectoryChecksum = async (str: string): Promise<string> => crypto.createHash('sha256').update(str, 'utf8').digest('hex');
