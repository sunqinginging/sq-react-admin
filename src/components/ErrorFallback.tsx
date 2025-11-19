import { type FallbackProps } from 'react-error-boundary';

export default function Fallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<div>
			<h2>出错啦！</h2>
			<p>{error.message}</p>
			<button onClick={resetErrorBoundary}>重试</button>
		</div>
	);
}
