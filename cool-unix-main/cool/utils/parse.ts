import { forEach, forInObject, isArray, isObject, isString } from "./comm";

/**
 * 解析数据
 * @example parse<Response>(res.data)
 */
export function parse<T>(data: any): T | null {
	// #ifdef APP-ANDROID
	// @ts-ignore
	return (data as UTSJSONObject).parse<T>();
	// #endif

	// #ifndef APP-ANDROID
	return data as T;
	// #endif
}

/**
 * 解析JSON对象
 * @param data 要解析的数据
 * @returns 解析后的JSON对象
 */
export function parseObject<T>(data: string): T | null {
	// #ifdef APP-ANDROID
	return JSON.parseObject<T>(data);
	// #endif

	// #ifndef APP-ANDROID
	return JSON.parse(data) as T;
	// #endif
}

/**
 * 解析透传样式对象
 * @param data 要解析的数据
 * @returns 解析后的透传样式对象
 * @template T 透传样式对象的类型
 */
export function parsePt<T>(data: any): T {
	// #ifdef APP-ANDROID
	// @ts-ignore
	return (data as UTSJSONObject).parse<T>() ?? ({} as T);
	// #endif

	// #ifndef APP-ANDROID
	return data as T;
	// #endif
}

/**
 * 解析对象为类名字符串
 * @param obj 要解析的对象,key为类名,value为布尔值表示是否启用该类名
 * @returns 解析后的类名字符串,多个类名以空格分隔
 * @example
 * parseClass({ 'active': true, 'disabled': false }) // 返回 'active'
 * parseClass(['ml-2', 'mr-2']) // 返回 'ml-2 mr-2'
 * parseClass([{ 'mr-2': true, 'mt-2': false }]) // 返回 'mr-2'
 * parseClass([[true, 'mr-2 pt-2', 'mb-2']]) // 返回 'mr-2 pt-2'
 */
export const parseClass = (data: any): string => {
	// 存储启用的类名
	const names: string[] = [];

	// 解析数据
	function deep(d: any) {
		// 如果obj是数组,则将数组中的每个元素添加到names中
		if (isArray(d)) {
			forEach(d as any[], (value: any) => {
				if (isString(value)) {
					// @example 2
					names.push(value as string);
				} else if (isArray(value)) {
					// @example 4
					const [a, b] = value as any[];
					if (a as boolean) {
						names.push(b as string);
					} else {
						if (value.length > 2) {
							names.push(value[2] as string);
						}
					}
				} else if (isObject(value)) {
					// @example 3
					deep(value);
				}
			});
		}

		// 遍历对象的每个属性
		if (isObject(d)) {
			// @example 1
			forInObject(d, (value, key) => {
				// 如果属性值为true,则将类名添加到数组中
				if (value == true && key != "") {
					names.push(key.trim());
				}
			});
		}
	}

	deep(data);

	// 将类名数组用空格连接成字符串返回
	return names.join(" ");
};

/**
 * 将自定义类型数据转换为UTSJSONObject对象
 * @param data 要转换的数据
 * @returns 转换后的UTSJSONObject对象
 */
export function parseToObject<T>(data: T): UTSJSONObject {
	// #ifdef APP-ANDROID
	return JSON.parseObject(JSON.stringify(data ?? {})!)!;
	// #endif

	// #ifndef APP-ANDROID
	return JSON.parse(JSON.stringify(data || {})) as UTSJSONObject;
	// #endif
}

/**
 * 将rpx单位转换为px单位
 * @param rpx 要转换的rpx值
 * @returns 转换后的px值
 * @example
 */
export const rpx2px = (rpx: number): number => {
	let px: number;

	// #ifdef MP
	px = rpx / (750 / uni.getWindowInfo().windowWidth);
	// #endif

	// #ifndef MP
	px = uni.rpx2px(rpx);
	// #endif

	return px;
};

/**
 * 将px单位转换为rpx单位
 * @param px 要转换的px值
 * @returns 转换后的rpx值
 * @example
 */
export const px2rpx = (px: number): number => {
	return px / rpx2px(1);
};

/**
 * 将数值或字符串转换为rpx单位的字符串
 * @param val 要转换的值,可以是数字或字符串
 * @returns 转换后的rpx单位字符串
 * @example
 * parseRpx(10) // 返回 '10rpx'
 * parseRpx('10rpx') // 返回 '10rpx'
 * parseRpx('10px') // 返回 '10px'
 */
export const parseRpx = (val: number | string): string => {
	if (typeof val == "number") {
		return val + "rpx";
	}

	return val;
};

/**
 * 示例: 获取数值部分
 * @example
 * getNum("10rpx") // 返回 10
 * getNum("10px")  // 返回 10
 * getNum("10")    // 返回 10
 * getNum("-5.5px") // 返回 -5.5
 * @param val - 输入值，例如 "10rpx"、"10px"、"10"
 * @returns number - 返回提取的数值
 */
export const getNum = (val: string): number => {
	// 使用正则提取数字部分，支持小数和负数
	const match = val.match(/-?\d+(\.\d+)?/);
	return match != null ? parseFloat(match[0] ?? "0") : 0;
};

/**
 * 示例: 获取单位
 * @example
 * getUnit("10rpx") // 返回 "rpx"
 * getUnit("10px")  // 返回 "px"
 * @param val - 输入值，例如 "10rpx"、"10px"
 * @returns string - 返回单位字符串，如 "rpx" 或 "px"
 */
export const getUnit = (val: string): string => {
	const num = getNum(val);
	return val.replace(`${num}`, "");
};

/**
 * 示例: 转换为 rpx 值
 * @example
 * getRpx("10rpx") // 返回 10
 * getRpx("10px")  // 返回 px2rpx(10)
 * getRpx(10)      // 返回 10
 * @param val - 输入值，可以是 "10rpx"、"10px" 或数字 10
 * @returns number - 返回对应的 rpx 数值
 */
export const getRpx = (val: number | string): number => {
	if (typeof val == "number") {
		return val;
	}

	const num = getNum(val);
	const unit = getUnit(val);

	if (unit == "px") {
		return px2rpx(num);
	}

	return num;
};

/**
 * 示例: 转换为 px 值
 * @example
 * getPx("10rpx") // 返回 rpx2px(10)
 * getPx("10px")  // 返回 10
 * getPx(10)      // 返回 rpx2px(10)
 * @param val - 输入值，可以是 "10rpx"、"10px" 或数字 10
 * @returns number - 返回对应的 px 数值
 */
export const getPx = (val: string | number) => {
	if (typeof val == "number") {
		return rpx2px(val);
	}

	const num = getNum(val);
	const unit = getUnit(val);

	if (unit == "rpx") {
		return rpx2px(num);
	}

	return num;
};
