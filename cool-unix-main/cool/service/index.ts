import { isDev, ignoreTokens, config } from "@/config";
import { locale, t } from "@/locale";
import { isNull, isObject, parse, storage } from "../utils";
import { useStore } from "../store";

// 请求参数类型定义
export type RequestOptions = {
	url: string; // 请求地址
	method?: RequestMethod; // 请求方法
	data?: any; // 请求体数据
	params?: any; // URL参数
	header?: any; // 请求头
	timeout?: number; // 超时时间
	withCredentials?: boolean; // 是否携带凭证
	firstIpv4?: boolean; // 是否优先使用IPv4
	enableChunked?: boolean; // 是否启用分块传输
};

// 响应数据类型定义
export type Response = {
	code?: number;
	message?: string;
	data?: any;
};

// 请求队列（用于等待token刷新后继续请求）
let requests: ((token: string) => void)[] = [];

// 标记token是否正在刷新
let isRefreshing = false;

// 判断当前url是否忽略token校验
const isIgnoreToken = (url: string) => {
	return ignoreTokens.some((e) => {
		const pattern = e.replace(/\*/g, ".*");
		return new RegExp(pattern).test(url);
	});
};

/**
 * 通用请求方法
 * @param options 请求参数
 * @returns Promise<T>
 */
export function request(options: RequestOptions): Promise<any | null> {
	let { url, method = "GET", data = {}, header = {}, timeout = 60000 } = options;

	const { user } = useStore();

	// 开发环境下打印请求信息
	if (isDev) {
		console.log(`[${method}] ${url}`);
	}

	// 拼接基础url
	if (!url.startsWith("http")) {
		url = config.baseUrl + url;
	}

	// 获取当前token
	let Authorization: string | null = null;
	
	// 检查header中是否需要token
	const needToken = header?.needToken === true;
	
	// 如果需要token且不在忽略列表中，则添加Bearer token
	if (needToken && user.token && !isIgnoreToken(url)) {
		Authorization = `Bearer ${user.token}`;
	}
	
	// 删除自定义的needToken标记
	if (header?.needToken !== undefined) {
		delete header.needToken;
	}

	return new Promise((resolve, reject) => {
		// 发起请求的实际函数
		const next = () => {
			uni.request({
				url,
				method,
				data,
				header: {
					Authorization,
					language: locale.value,
					...(header as UTSJSONObject)
				},
				timeout,

				success(res) {
					// 401 无权限
					if (res.statusCode == 401) {
						user.logout();
						reject({ message: t("无权限") } as Response);
					}

					// 502 服务异常
					else if (res.statusCode == 502) {
						reject({
							message: t("服务异常")
						} as Response);
					}

					// 404 未找到
					else if (res.statusCode == 404) {
						return reject({
							message: `[404] ${url}`
						} as Response);
					}

					// 200 正常响应
					else if (res.statusCode == 200) {
						if (res.data == null) {
							resolve(null);
						} else if (!isObject(res.data as any)) {
							resolve(res.data);
						} else {
							// 解析响应数据
							const { code, message, data } = parse<Response>(
								res.data ?? { code: 0 }
							)!;

							switch (code) {
								case 0:
								case 200:
									resolve(data);
									break;
								default:
									reject({ message, code } as Response);
									break;
							}
						}
					} else {
						reject({ message: t("服务异常") } as Response);
					}
				},

				// 网络请求失败
				fail(err) {
					reject({ message: err.errMsg } as Response);
				}
			});
		};

		// 直接发起请求，由后端返回401时处理token过期
		next();
	});
}
