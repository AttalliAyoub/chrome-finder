import { darwin } from './darwin.ts';
import { linux } from './linux.ts';
import type { PathLike } from "./types.ts";
import { win32 } from './win32.ts';

export type { PathLike };

const ERROR_PLATFORM_NOT_SUPPORT = new Error("platform not support");
const ERROR_NO_INSTALLATIONS_FOUND = new Error("no chrome installations found");

/**
 * find a executable chrome for all support system
 * @returns {string} executable chrome full path
 * @throws
 * if no executable chrome find, ERROR_NO_INSTALLATIONS_FOUND will be throw
 * if platform is not one if ['win32','darwin','linux'], ERROR_PLATFORM_NOT_SUPPORT will be throw
 */
export function findChrome(): PathLike {
	const { os } = Deno.build;
	let installations = [];
	
	switch (os) {
		case "windows":
			installations = win32();
			break;
		case "darwin":
			installations = darwin();
			break;
		case "linux":
			installations = linux();
			break;
		default:
			throw ERROR_PLATFORM_NOT_SUPPORT;
	}
	if (installations.length) {
		return installations[0];
	} else {
		throw ERROR_NO_INSTALLATIONS_FOUND;
	}
}

export default findChrome;
