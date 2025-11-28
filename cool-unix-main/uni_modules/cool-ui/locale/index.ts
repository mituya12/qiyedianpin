import { appendLocale } from "@/locale";

import zhcn from "./zh-cn.json";
import zhtw from "./zh-tw.json";
import en from "./en.json";
import es from "./es.json";
import ja from "./ja.json";
import fr from "./fr.json";
import ko from "./ko.json";

setTimeout(() => {
	appendLocale("zh-cn", zhcn);
	appendLocale("zh-tw", zhtw);
	appendLocale("en", en);
	appendLocale("es", es);
	appendLocale("ja", ja);
	appendLocale("fr", fr);
	appendLocale("ko", ko);
}, 0);
