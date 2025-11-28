import type { QrcodeOptions } from "./draw";
import type { ClQrcodeMode } from "../../types";

export type ClQrcodeProps = {
	className?: string;
	width?: string;
	height?: string;
	foreground?: string;
	background?: string;
	pdColor?: string | any;
	pdRadius?: number;
	text?: string;
	logo?: string;
	logoSize?: string;
	padding?: number;
	mode?: ClQrcodeMode;
};
