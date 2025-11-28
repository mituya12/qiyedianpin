import { isNull, router, useStore } from "@/cool";

/**
 * 路由跳转前的全局钩子（如修改 pages.json 后需重新编译项目以确保路由信息生效）
 * @param to 跳转页
 * @param from 当前页
 * @param next 跳转函数
 */
router.beforeEach((to, from, next) => {
	const { user } = useStore();

	// 判断是否需要登录
	if (to.isAuth == true || (isNull(to.meta) ? true : to.meta.isAuth == true)) {
		// 如果用户信息为空，则跳转到登录页
		if (!user.isNull()) {
			next();
		} else {
			router.login();
		}
	} else {
		next();
	}
});
