import { request } from "@/cool/service";

/**
 * 用户模块API
 */

// 微信登录
export const loginByWechat = (code: string) => {
	return request({
		url: "/api/c/user/login",
		method: "POST",
		data: { code }
	});
};

// 获取用户信息
export const getUserInfo = () => {
	return request({
		url: "/api/c/user/info",
		method: "GET",
		header: {
			needToken: true
		}
	});
};

// 更新用户信息
export const updateUserInfo = (data: { bio?: string; status?: number }) => {
	return request({
		url: "/api/c/user/info",
		method: "PUT",
		data,
		header: {
			needToken: true
		}
	});
};
