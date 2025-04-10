import { join } from "@std/path";
import type { PathLike, PriorityPair } from "./types.ts";
import { canAccess, isExecutable, sort } from "./util.ts";

function findChromeExecutablesForLinuxDesktop(folder: PathLike): PathLike[] {
	const argumentsRegex = /(^[^ ]+).*/; // Take everything up to the first space
	const chromeExecRegex = "^Exec=\/.*\/(google|chrome|chromium)-.*";

	if (!canAccess(folder)) return [];

	const installations: PathLike[] = [];

	// Output of the grep & print looks like:
	//    /opt/google/chrome/google-chrome --profile-directory
	//    /home/user/Downloads/chrome-linux/chrome-wrapper %U
	const { stdout } = new Deno.Command("sh", {
		args: [
			"-c",
			`find "${folder}" -type f -exec grep -E "${chromeExecRegex}" "{}" \\; | awk -F '=' '{print $2}'`,
		],
	}).outputSync();

	const execPath = new TextDecoder().decode(stdout);
	const execPaths = execPath
		.split(/\r?\n/)
		.map((execPath) => execPath.replace(argumentsRegex, "$1"));

	for (const execPath of execPaths) {
		// TODO: Check if the execPath is a executable
		if (!canAccess(execPath)) continue;
		installations.push(execPath);
	}
	return installations;
}

/**
 * Look for linux executables in 2 ways
 * 1. Look into the directories where .desktop are saved on gnome based distro's
 * 2. Look for google-chrome-stable & google-chrome executables by using the which command
 */
export function linux() {
	let installations: PathLike[] = [];
	const homedir = Deno.env.get("HOME") || Deno.env.get("USERPROFILE");
	// 2. Look into the directories where .desktop are saved on gnome based distro's
	const desktopInstallationFolders = [
		join(homedir!, ".local/share/applications/"),
		"/usr/share/applications/",
	];
	for (const folder of desktopInstallationFolders) {
		installations = installations.concat(
			findChromeExecutablesForLinuxDesktop(folder),
		);
	}

	// Look for google-chrome-stable & google-chrome executables by using the which command
	const executables = [
		"google-chrome-stable",
		"google-chrome",
		"chromium",
		"chromium-browser",
		"chromium/chrome", // on toradex machines "chromium" is a directory. seen on Angstrom v2016.12
	];

	for (const executable of executables) {
		// see http://tldp.org/LDP/Linux-Filesystem-Hierarchy/html/
		const possibleChromePaths = [
			"/usr/bin",
			"/usr/local/bin",
			"/usr/sbin",
			"/usr/local/sbin",
			"/opt/bin",
			"/usr/bin/X11",
			"/usr/X11R6/bin",
		];
		const validChromePaths: PathLike[] = [];
		for (const possiblePath of possibleChromePaths) {
			const chromePathToTest = join(possiblePath, executable);
			if (!isExecutable(chromePathToTest)) continue;
			if (!chromePathToTest) continue;
			installations.push(chromePathToTest);
			validChromePaths.push(chromePathToTest);
		}

		// skip asking "which" command if the binary was found by searching the known paths.
		if (validChromePaths.length) continue;

		try {
			const { stdout } = new Deno.Command("which", {
				args: [executable],
				stdin: "null",
				stdout: "piped",
				stderr: "null",
			}).outputSync();
			const chromePath =
				new TextDecoder().decode(stdout).split(/\r?\n/)[0];
			if (canAccess(chromePath)) installations.push(chromePath);
		} catch (_err) {
			// cmd which not installed.
		}
	}

	const priorities: PriorityPair[] = [
		{ regex: /chromium$/, weight: 52 },
		{ regex: /chrome-wrapper$/, weight: 51 },
		{ regex: /google-chrome-stable$/, weight: 50 },
		{ regex: /google-chrome$/, weight: 49 },
		{ regex: /chromium-browser$/, weight: 48 },
		{ regex: /chrome$/, weight: 47 },
	];

	return sort(Array.from(new Set(installations.filter(Boolean))), priorities);
}

export default linux;
