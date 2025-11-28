import { request } from "@/cool/service";

/**
 * 回复模块API
 */

// 发布回复
export const createReply = (data: { reviewId: number; content: string }) => {
	return request({
		url: "/api/c/reply/create",
		method: "POST",
		data,
		header: {
			needToken: true
		}
	});
};

// 我的回复列表
export const getMyReplies = (params?: { page?: number; pageSize?: number }) => {
	return request({
		url: "/api/c/reply/my-list",
		method: "GET",
		data: params,
		header: {
			needToken: true
		}
	});
};
