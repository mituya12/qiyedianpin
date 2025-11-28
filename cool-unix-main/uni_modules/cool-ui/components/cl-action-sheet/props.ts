import type { ClActionSheetItem, ClActionSheetOptions, PassThroughProps } from "../../types";

export type ClActionSheetPassThrough = {
	className?: string;
	item?: PassThroughProps;
	list?: PassThroughProps;
};

export type ClActionSheetProps = {
	className?: string;
	pt?: ClActionSheetPassThrough;
};
