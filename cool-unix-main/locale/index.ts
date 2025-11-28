import { isNull, forInObject, isEmpty, storage, router } from "@/cool";
import { ref } from "vue";
import zhcn from "./zh-cn.json";
import zhtw from "./zh-tw.json";
import en from "./en.json";
import es from "./es.json";
import ja from "./ja.json";
import ko from "./ko.json";
import fr from "./fr.json";
import { config } from "@/config";

// 解析语言包
function parse(val: string[][]) {
	const isCustom = val.length == 1 && val[0].length == 1;

	if (!isCustom) {
		return val;
	}

	return val[0][0].split("<__&__>").map((e) => e.split("<__=__>"));
}

/**
 * 语言包映射对象，包含所有已支持的语言。
 * 如需新增语言，只需新建对应的 xx.json 文件并在此处引入即可。
 */
const messages = {
	"zh-cn": parse(zhcn),
	"zh-tw": parse(zhtw),
	en: parse(en),
	es: parse(es),
	ja: parse(ja),
	ko: parse(ko),
	fr: parse(fr)
};

// 当前语言，默认中文
export const locale = ref<string>("");

// 设置当前语言
export const setLocale = (value: string) => {
	locale.value = value;

	// #ifdef APP
	// APP 环境下，存储语言到本地
	storage.set("locale", value, 0);
	// #endif

	// #ifndef APP
	// 其他环境下，直接设置全局语言
	uni.setLocale(value);
	// #endif
};

// 获取当前语言
export const getLocale = (): string => {
	let value: string;

	// #ifdef APP
	// APP 环境下，优先从本地存储获取
	const _locale = storage.get("locale") as string | null;

	if (_locale != null && !isEmpty(_locale)) {
		value = _locale;
	} else {
		// @ts-ignore
		value = uni.getDeviceInfo().osLanguage as string;
	}

	// #endif

	// #ifndef APP
	// 其他环境下，直接获取全局语言
	value = uni.getLocale();
	// #endif

	if (isNull(value) || isEmpty(value)) {
		value = config.locale;
	}

	return value;
};

// 追加数据
export const appendLocale = (name: string, data: string[][]) => {
	if (messages[name] != null) {
		(messages[name] as string[][]).unshift(...parse(data));
	}
};

// 不带参数的翻译方法
export const t = (name: string) => {
	let data = messages[locale.value] as string[][] | null;

	if (data == null) {
		return name;
	}

	let text = data.find((e) => e[0] == name)?.[1];

	if (text == null || text == "") {
		text = name;
	}

	return text;
};

// 带参数的翻译方法
export const $t = (name: string, data: any) => {
	let text = t(name);

	// 替换参数
	if (!isNull(data)) {
		forInObject(data, (value, key) => {
			if (typeof value === "number") {
				value = value.toString();
			}

			text = text.replaceAll(`{${key}}`, value as string);
		});
	}

	return text;
};

// 初始化语言设置
export const initLocale = () => {
	locale.value = getLocale();

	// #ifndef APP
	// 监听语言切换事件，自动更新 locale
	uni.onLocaleChange((res) => {
		setLocale(res.locale!);
	});
	// #endif
};

// 更新标题
export function updateTitle() {
	const style = router.route()?.style;

	if (style != null) {
		if (style.navigationBarTitleText != null) {
			uni.setNavigationBarTitle({
				title: t(style.navigationBarTitleText as string)
			});
		}
	}
}
