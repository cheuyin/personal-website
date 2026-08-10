import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import { getWritingPosts } from './lib/content';
import { site } from './data/site';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import WorkPage from './pages/WorkPage';
import WritingIndexPage from './pages/WritingIndexPage';
import WritingPostPage from './pages/WritingPostPage';

const writingPosts = getWritingPosts();

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage posts={writingPosts} />} />
				<Route path="/work" element={<WorkPage />} />
				<Route path="/writing" element={<WritingIndexPage posts={writingPosts} />} />
				<Route path="/writing/:slug" element={<WritingPostPage />} />
				<Route path="*" element={<NotFoundPage />} />
			</Routes>
		</BrowserRouter>
	);
}
