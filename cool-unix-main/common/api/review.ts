import { request } from "@/cool/service";

/**
 * 评价模块API
 */

// 获取评价列表
export const getReviewList = (params: {
	companyName: string;
	rating?: number;
	page?: number;
	pageSize?: number;
	sortField?: string;
	order?: string;
}) => {
	return request({
		url: "/api/c/review/list",
		method: "GET",
		data: params
	});
};

// 获取评价详情
export const getReviewDetail = (id: number | string) => {
	return request({
		url: `/api/c/review/detail/${id}`,
		method: "GET"
	});
};

// 发布评价
export const createReview = (data: {
	companyName: string;
	companyAlias?: string;
	status: string;
	department: string;
	isBranch: boolean;
	rating: number;
	content: string;
	salary?: string;
	benefits?: string;
}) => {
	return request({
		url: "/api/c/review/create",
		method: "POST",
		data,
		header: {
			needToken: true
		}
	});
};

// 删除评价
export const deleteReview = (id: number | string) => {
	return request({
		url: `/api/c/review/delete/${id}`,
		method: "DELETE",
		header: {
			needToken: true
		}
	});
};

// 点赞评价
export const likeReview = (id: number | string) => {
	return request({
		url: `/api/c/review/like/${id}`,
		method: "POST",
		header: {
			needToken: true
		}
	});
};

// 举报评价
export const reportReview = (id: number | string, data: { reason: string; description?: string }) => {
	return request({
		url: `/api/c/report/create`,
		method: "POST",
		data: {
			contentType: "review",
			contentId: id,
			reason: data.reason,
			description: data.description || ""
		},
		header: {
			needToken: true
		}
	});
};

// 我的评价列表
export const getMyReviews = (params?: { page?: number; pageSize?: number }) => {
	return request({
		url: "/api/c/review/my-list",
		method: "GET",
		data: params,
		header: {
			needToken: true
		}
	});
};
