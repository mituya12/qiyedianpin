import type { ClUploadItem, PassThroughProps } from "../../types";

export type ClUploadPassThrough = {
	className?: string;
	item?: PassThroughProps;
	add?: PassThroughProps;
	image?: PassThroughProps;
	icon?: PassThroughProps;
	text?: PassThroughProps;
};

export type ClUploadProps = {
	className?: string;
	pt?: ClUploadPassThrough;
	modelValue?: string[] | string;
	icon?: string;
	text?: string;
	sizeType?: string[] | string;
	sourceType?: string[];
	height?: any;
	width?: any;
	multiple?: boolean;
	limit?: number;
	disabled?: boolean;
	test?: boolean;
};
