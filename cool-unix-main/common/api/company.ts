import { request } from "@/cool/service";

/**
 * 企业模块API
 */

// 搜索企业
export const searchCompany = (params: {
	keyword?: string;
	page?: number;
	pageSize?: number;
}) => {
	return request({
		url: "/api/c/company/search",
		method: "GET",
		data: params
	});
};

// 获取企业详情
export const getCompanyDetail = (id: number | string) => {
	return request({
		url: `/api/c/company/detail/${id}`,
		method: "GET"
	});
};

// 获取热门企业列表
export const getTrendingCompanies = () => {
	return request({
		url: "/api/c/company/trending",
		method: "GET"
	});
};

// 获取搜索建议（猜你想搜）
export const getCompanySuggestions = (keyword: string, limit: number = 10) => {
	return request({
		url: "/api/c/company/suggestions",
		method: "GET",
		data: {
			keyword,
			limit
		}
	});
};

// 获取相似企业
export const getSimilarCompanies = (id: number | string) => {
	return request({
		url: `/api/c/company/similar/${id}`,
		method: "GET"
	});
};
