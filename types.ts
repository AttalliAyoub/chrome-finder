export type PathLike = string | URL;

export interface PriorityPair {
	regex: RegExp;
	weight: number;
}

export interface PriorityResult {
	path: PathLike;
	weight: number;
}
