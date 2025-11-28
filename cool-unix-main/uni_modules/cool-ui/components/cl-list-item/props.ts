import type { Justify, PassThroughProps } from "../../types";
import type { ClIconProps } from "../cl-icon/props";
import type { ClImageProps } from "../cl-image/props";

export type ClListItemPassThrough = {
	className?: string;
	wrapper?: PassThroughProps;
	inner?: PassThroughProps;
	label?: PassThroughProps;
	content?: PassThroughProps;
	icon?: ClIconProps;
	image?: ClImageProps;
	collapse?: PassThroughProps;
};

export type ClListItemProps = {
	className?: string;
	pt?: ClListItemPassThrough;
	icon?: string;
	image?: string;
	label?: string;
	justify?: Justify;
	arrow?: boolean;
	swipeable?: boolean;
	hoverable?: boolean;
	disabled?: boolean;
	collapse?: boolean;
};
