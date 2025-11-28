export const proxy = {
	// 开发环境配置
	dev: {
		// 本地后端地址
		target: "http://192.168.1.8:3000",
		changeOrigin: true,
		rewrite: (path: string) => path.replace("/dev", "")
	},

	// 生产环境配置
	prod: {
		// 官方测试地址
		target: "http://192.168.1.8:3000",
		changeOrigin: true,
		rewrite: (path: string) => path.replace("/prod", "/api")
	}
};

export const value = "dev";
