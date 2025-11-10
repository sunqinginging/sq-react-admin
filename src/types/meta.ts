export interface RouteMeta {
	title?: string;
	keepAlive?: boolean;
	auth?: boolean | string[];
	[key: string]: any;
}
