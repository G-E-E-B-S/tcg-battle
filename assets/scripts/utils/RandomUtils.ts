import { Random, RandomFunc } from "../models/random";

const localEngine : RandomFunc = setSeed(Random.engines["mt19937"]());

export function setSeed(engine : RandomFunc) : RandomFunc {
	let max_int = 1<<32 - 1;
	let seed = Date.now()%max_int;
	console.log("Will set seed", seed);
	return engine.seed(seed);
}

export function getRandomInt(min: number, max: number, engine? : RandomFunc): number {
	if (!engine) {
		engine = localEngine;
	}
	return Random.integer(min, max)(engine)
}

export function getRandomElement(array : Array<any>, engine? : RandomFunc) : any {
	if (!array || array.length == 0) {
		return null;
	}
	return array[getRandomInt(0, array.length - 1, engine)];
}

export function popRandomElement(array : Array<any>, engine? : RandomFunc) : any {
	if (!array || array.length == 0) {
		return null;
	}
	const randIdx = getRandomInt(0, array.length - 1, engine);
	return array.splice(randIdx, 1)[0];
}

export function generateUuid4(engine? : RandomFunc) {
	if (!engine) {
		engine = localEngine;
	}
	return Random.uuid4(engine);
}
