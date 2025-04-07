import { } from '@std/fs';

export const newLineRegex = /\r?\n/;

export function sort(installations, priorities) {
    const defaultPriority = 10;
    // assign priorities
    return installations
        .map((inst) => {
            for (const pair of priorities) {
                if (pair.regex.test(inst)) {
                    return { path: inst, weight: pair.weight };
                }
            }
            return { path: inst, weight: defaultPriority };
        })
        // sort based on priorities
        .sort((a, b) => (b.weight - a.weight))
        // remove priority flag
        .map(pair => pair.path);
}

export function canAccess(file) {
    if (!file) {
        return false;
    }

    try {
        fs.accessSync(file);
        return true;
    } catch (e) {
        return false;
    }
}

export function isExecutable(file: string | URL) {
    if (!file) return false;
    try {
        const stat = Deno.statSync(file);
        return stat.isFile;
    } catch (_error) {
        return false;
    }
}
