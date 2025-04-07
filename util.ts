import { AccessMode, accessSync } from '@attalliayoub/fs-access';

export const newLineRegex = /\r?\n/;

export interface PriorityPair {
    regex: RegExp;
    weight: number;
}

export interface PriorityResult {
    path: PathLike;
    weight: number;
}

export type PathLike = string | URL;

export function sort(installations: PathLike[], priorities: PriorityPair[]): PathLike[] {
    const list: PriorityResult[] = installations
        .map((inst) => {
            for (const pair of priorities)
                if (pair.regex.test(inst.toString()))
                    return { path: inst, weight: pair.weight };
            return { path: inst, weight: 10 };
        });
    return list.sort((a, b) => (b.weight - a.weight)).map(pair => pair.path);
}

export function canAccess(file: string | URL) {
    if (!file) return false;
    try {
        accessSync(file);
        return true;
    } catch {
        return false;
    }
}

export function isExecutable(file: string | URL) {
    if (!file) return false;
    try {
        accessSync(file, AccessMode.X_OK);
        return true;
    } catch {
        return false;
    }
}
