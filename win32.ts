import { join } from "@std/path";
import type { PathLike } from "./types.ts";
import { canAccess } from "./util.ts";

export function win32() {
	const installations: PathLike[] = [];
	const suffixes = [
		"\\Google\\Chrome SxS\\Application\\chrome.exe",
		"\\Google\\Chrome\\Application\\chrome.exe",
		"\\chrome-win32\\chrome.exe",
		"\\Chromium\\Application\\chrome.exe",
		"\\Google\\Chrome Beta\\Application\\chrome.exe",
	];
	const prefixes = [
		Deno.env.get("LOCALAPPDATA"),
		Deno.env.get("PROGRAMFILES"),
		Deno.env.get("PROGRAMFILES(X86)"),
	];

	for (const prefix of prefixes) {
		for (const suffix of suffixes) {
			if (!prefix) continue;
			const chromePath = join(prefix, suffix);
			if (!canAccess(chromePath)) continue;
			installations.push(chromePath);
		}
	}
	return installations;
}

export default win32;
