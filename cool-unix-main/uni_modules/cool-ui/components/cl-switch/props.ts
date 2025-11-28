import type { PassThroughProps } from "../../types";

export type ClSwitchPassThrough = {
	className?: string;
	track?: PassThroughProps;
	thumb?: PassThroughProps;
	label?: PassThroughProps;
	loading?: PassThroughProps;
};

export type ClSwitchProps = {
	className?: string;
	pt?: ClSwitchPassThrough;
	modelValue?: boolean;
	disabled?: boolean;
	loading?: boolean;
	height?: number;
	width?: number;
};
