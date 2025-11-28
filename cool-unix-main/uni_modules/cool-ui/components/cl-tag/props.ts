import type { Type } from "../../types";
import type { ClTextPassThrough } from "../cl-text/props";

export type ClTagPassThrough = {
	className?: string;
	text?: ClTextPassThrough;
};

export type ClTagProps = {
	className?: string;
	pt?: ClTagPassThrough;
	type?: Type;
	icon?: string;
	rounded?: boolean;
	closable?: boolean;
	plain?: boolean;
};
