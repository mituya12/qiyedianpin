export {};

declare module "vue" {
	export interface GlobalComponents {
		"cl-svg": (typeof import("./components/cl-svg/cl-svg.uvue"))["default"];
	}
}
