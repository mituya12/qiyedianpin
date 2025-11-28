import type { ClIconProps } from "../cl-icon/props";
import type { PassThroughProps } from "../../types";

export type ClSelectTriggerPassThrough = {
	className?: string;
	icon?: ClIconProps;
	placeholder?: PassThroughProps;
	text?: PassThroughProps;
};

export type ClSelectTriggerProps = {
	className?: string;
	pt?: ClSelectTriggerPassThrough;
	text?: string;
	placeholder?: string;
	arrowIcon?: string;
	disabled?: boolean;
	focus?: boolean;
};
