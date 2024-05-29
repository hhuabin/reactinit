export default class FunctionUtil {

	/**
	 * 深复制函数
	 * @param obj T
	 * @returns T
	 */
	public static deepCopy = <T>(obj: T): T => {
		if (obj === null || typeof obj !== 'object') {
			return obj;
		}

		const copy = (Array.isArray(obj) ? [] : {}) as T;

		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				copy[key] = FunctionUtil.deepCopy(obj[key]);
			}
		}

		return copy;
	}

	/**
	 * JSON深复制
	 * @param obj T
	 * @returns T
	 */
	public static deepCopyWithJSON = <T>(obj: T): T => {

		return JSON.parse(JSON.stringify(obj));

	}
}
