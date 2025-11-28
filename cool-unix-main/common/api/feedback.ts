import { request } from "@/cool/service";

/**
 * 反馈模块API
 */

// 提交反馈
export const createFeedback = (data: {
	category: string;
	content: string;
	contact?: string;
}) => {
	return request({
		url: "/api/c/feedback/create",
		method: "POST",
		data,
		header: {
			needToken: true
		}
	});
};

// 获取我的反馈列表
export const getFeedbackList = (params?: { page?: number; pageSize?: number }) => {
	return request({
		url: "/api/c/feedback/list",
		method: "GET",
		data: params,
		header: {
			needToken: true
		}
	});
};

// 获取反馈详情
export const getFeedbackDetail = (id: number | string) => {
	return request({
		url: `/api/c/feedback/detail/${id}`,
		method: "GET",
		header: {
			needToken: true
		}
	});
};
