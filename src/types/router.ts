import type { RouteObject } from 'react-router-dom';
import type { RouteMeta } from './meta';

/** 扩展官方 RouteObject，增加 meta 定义 */
export type RouteObjectWithMeta = Omit<RouteObject, 'handle'> & {
	handle?: RouteMeta;
};
