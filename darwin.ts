// const { execSync } = require("child_process");
import { join } from "@std/path";
import type { PathLike, PriorityPair } from "./types.ts";
import { canAccess, sort } from "./util.ts";

export function darwin(): PathLike[] {
	const suffixes = [
		"/Contents/MacOS/Google Chrome Canary",
		"/Contents/MacOS/Google Chrome",
		"/Contents/MacOS/Chromium",
	];

	const LSREGISTER = "/System/Library/Frameworks/CoreServices.framework" +
		"/Versions/A/Frameworks/LaunchServices.framework" +
		"/Versions/A/Support/lsregister";

	const installations: PathLike[] = [];

	const { stdout } = new Deno.Command("sh", {
		args: [
			"-c",
			`${LSREGISTER} -dump | grep -E -i -o '/.+(google chrome( canary)?|chromium)\\.app(\\s|$)' | grep -E -v 'Caches|TimeMachine|Temporary|/Volumes|\\.Trash'`,
		],
	}).outputSync();

	const execPath = new TextDecoder().decode(stdout).trim();
	execPath
		.toString()
		.split(/\r?\n/)
		.forEach((inst) => {
			suffixes.forEach((suffix) => {
				const execPath = join(inst.trim(), suffix);
				if (canAccess(execPath)) {
					installations.push(execPath);
				}
			});
		});

	const home = Deno.env.get("HOME") || Deno.env.get("USERPROFILE");

	// Retains one per line to maintain readability.
	const priorities: PriorityPair[] = [
		{
			regex: new RegExp(`^${home}/Applications/.*Chromium.app`),
			weight: 49,
		},
		{
			regex: new RegExp(`^${home}/Applications/.*Chrome.app`),
			weight: 50,
		},
		{
			regex: new RegExp(`^${home}/Applications/.*Chrome Canary.app`),
			weight: 51,
		},
		{ regex: /^\/Applications\/.*Chromium.app/, weight: 99 },
		{ regex: /^\/Applications\/.*Chrome.app/, weight: 100 },
		{ regex: /^\/Applications\/.*Chrome Canary.app/, weight: 101 },
		{ regex: /^\/Volumes\/.*Chromium.app/, weight: -3 },
		{ regex: /^\/Volumes\/.*Chrome.app/, weight: -2 },
		{ regex: /^\/Volumes\/.*Chrome Canary.app/, weight: -1 },
	];

	return sort(installations, priorities);
}

export default darwin;
