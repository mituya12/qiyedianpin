import { reactive, watch } from "vue";
import { isDark } from "../theme";

type CacheData = {
	key: number;
};

type UseCache = {
	cache: CacheData;
};

export const useCache = (source: () => any[]): UseCache => {
	const cache = reactive<CacheData>({
		key: 0
	});

	watch(source, () => {
		cache.key++;
	});

	watch(isDark, () => {
		cache.key++;
	});

	return {
		cache
	};
};
