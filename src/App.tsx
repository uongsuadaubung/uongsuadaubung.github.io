import { currentView } from './lib/nav';
import Navbar from './lib/components/Navbar';
import Footer from './lib/components/Footer';
import HomeView from './lib/views/HomeView';
import BlogView from './lib/views/BlogView';
import PostView from './lib/views/PostView';
import AboutView from './lib/views/AboutView';
import EcosystemView from './lib/views/EcosystemView';

export default function App() {
	return (
		<div id="app">
			<Navbar />
			<main style={{ flex: '1' }}>
				{(() => {
					const view = currentView();
					switch (view.id) {
						case 'home':
							return <HomeView />;
						case 'blog':
							return <BlogView />;
						case 'apps':
							return <EcosystemView />;
						case 'post':
							return <PostView slug={view.slug} />;
						case 'about':
							return <AboutView />;
						default:
							return <HomeView />;
					}
				})()}
			</main>
			<Footer />
		</div>
	);
}
