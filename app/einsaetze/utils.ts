import fs from 'fs/promises';
import path from 'path';

export async function readEinsaetze() {
    const filePath = path.join(process.cwd(), 'app', 'data', 'einsaetze.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
}