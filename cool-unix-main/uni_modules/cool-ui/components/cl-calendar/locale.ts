import { appendLocale } from "@/locale";

setTimeout(() => {
	appendLocale("zh-cn", [
		["周日", "日"],
		["周一", "一"],
		["周二", "二"],
		["周三", "三"],
		["周四", "四"],
		["周五", "五"],
		["周六", "六"],
		["{year}年{month}月", "{year}年{month}月"]
	]);

	appendLocale("zh-tw", [
		["周日", "週日"],
		["周一", "週一"],
		["周二", "週二"],
		["周三", "週三"],
		["周四", "週四"],
		["周五", "週五"],
		["周六", "週六"],
		["{year}年{month}月", "{year}年{month}月"]
	]);

	appendLocale("en", [
		["周日", "Sun"],
		["周一", "Mon"],
		["周二", "Tue"],
		["周三", "Wed"],
		["周四", "Thu"],
		["周五", "Fri"],
		["周六", "Sat"],
		["{year}年{month}月", "{month}/{year}"]
	]);

	appendLocale("ja", [
		["周日", "日曜"],
		["周一", "月曜"],
		["周二", "火曜"],
		["周三", "水曜"],
		["周四", "木曜"],
		["周五", "金曜"],
		["周六", "土曜"],
		["{year}年{month}月", "{year}年{month}月"]
	]);

	appendLocale("ko", [
		["周日", "일"],
		["周一", "월"],
		["周二", "화"],
		["周三", "수"],
		["周四", "목"],
		["周五", "금"],
		["周六", "토"],
		["{year}年{month}月", "{year}년 {month}월"]
	]);

	appendLocale("fr", [
		["周日", "Dim"],
		["周一", "Lun"],
		["周二", "Mar"],
		["周三", "Mer"],
		["周四", "Jeu"],
		["周五", "Ven"],
		["周六", "Sam"],
		["{year}年{month}月", "{month}/{year}"]
	]);

	appendLocale("es", [
		["周日", "Dom"],
		["周一", "Lun"],
		["周二", "Mar"],
		["周三", "Mié"],
		["周四", "Jue"],
		["周五", "Vie"],
		["周六", "Sáb"],
		["{year}年{month}月", "{month}/{year}"]
	]);
}, 0);
