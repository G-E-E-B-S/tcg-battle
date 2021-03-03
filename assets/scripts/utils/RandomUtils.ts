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

export function getRandomIntWithExclusion(min: number, max: number, exclusions: Array<number>, engine? : RandomFunc): number {
	if (!engine) {
		engine = localEngine;
	}

	let rand = Random.integer(min, max)(engine);
	while (exclusions.indexOf(rand) != -1)
		rand = Random.integer(min, max)(engine);

	return rand;
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

class AnimationTarget {
	play(animation: cc.Animation, clip?: string, onFinished?: any, target?: any) {
		animation.targetOff(this);
		animation.stop();
		//
		animation.play(clip);
		animation.once('finished', () => {
			if (cc.isValid(onFinished)) {
				if (cc.isValid(target)) {
					onFinished.apply(target);
				} else {
					onFinished();
				}
			}
		}, this);
	}
}

export function playAnimOnce(animation: cc.Animation, clip: cc.AnimationClip | string, target?: any, onFinished?: (arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any) => any, playAfterDelay: number = 0) {
	let clipName = "";
	if (clip) {
		if (clip instanceof cc.AnimationClip) {
			clipName = clip.name;
		} else {
			clipName = clip;
		}
	}
	let func = () => {
		(new AnimationTarget()).play(animation, clipName, onFinished, target);
	}
	if (playAfterDelay > 0) {
		this.delayCall(playAfterDelay, func, animation.node);
	} else {
		func();
	}
}
