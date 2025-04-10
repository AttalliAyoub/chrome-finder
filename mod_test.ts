import { assert } from '@std/assert';
import { findChrome } from "./mod.ts";

Deno.test(function chromePath() {
	const chromePath = findChrome().toString();
	assert(chromePath.length > 0);
	assert(chromePath.includes("chrom"));
	console.log(chromePath);
});
