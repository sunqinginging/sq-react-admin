import type { LazyExoticComponent } from 'react';
import React from 'react';

export const componentMap: Record<string, LazyExoticComponent<any>> = {
	'/dashboard': React.lazy(() => import('@/views/Dashboard')),
	'/system': React.lazy(() => import('@/views/system/Index')),
	'/system/user': React.lazy(() => import('@/views/system/User')),
	'/system/role': React.lazy(() => import('@/views/system/Role')),
};
