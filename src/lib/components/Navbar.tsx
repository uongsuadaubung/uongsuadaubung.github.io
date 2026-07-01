import { createSignal, For } from 'solid-js';
import ThemeToggle from './ThemeToggle';
import { currentView, nav } from '../nav';
import './Navbar.scss';

export default function Navbar() {
	const [mobileOpen, setMobileOpen] = createSignal(false);

	const navLinks = [
		{ id: 'home', label: 'Home', external: false, url: '' },
		{ id: 'blog', label: 'Blog', external: false, url: '' },
		{ id: 'cozy', label: 'Cozy', external: true, url: '/cozy/' },
		{ id: 'about', label: 'About', external: false, url: '' },
		{ id: 'resume', label: 'Resume', external: false, url: '' }
	] as const;

	function go(id: 'home' | 'blog' | 'about' | 'resume') {
		nav[id]();
		setMobileOpen(false);
	}

	return (
		<header class="navbar">
			<div class="container navbar-inner">
				<button class="logo" onClick={() => go('home')}>
					<span class="logo-mark">✦</span>
					<span class="logo-text">uongsuadaubung</span>
				</button>

				<nav class="nav-links" aria-label="Main navigation">
					<For each={navLinks}>
						{(link) => {
							if (link.external) {
								return (
									<a
										class="nav-link"
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
									>
										{link.label}
									</a>
								);
							}
							const active = () => {
								const current = currentView();
								return current.id === link.id || (link.id === 'blog' && current.id === 'post');
							};
							return (
								<button
									class={`nav-link ${active() ? 'active' : ''}`}
									onClick={() => go(link.id as any)}
								>
									{link.label}
								</button>
							);
						}}
					</For>
				</nav>

				<div class="nav-actions">
					<ThemeToggle />
					<button
						class="hamburger"
						onClick={() => setMobileOpen(!mobileOpen())}
						aria-label="Menu"
						aria-expanded={mobileOpen()}
					>
						<span></span><span></span><span></span>
					</button>
				</div>
			</div>

			<div class={`mobile-menu ${mobileOpen() ? 'open' : ''}`}>
				<For each={navLinks}>
					{(link) => {
						if (link.external) {
							return (
								<a
									class="mobile-link"
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									onClick={() => setMobileOpen(false)}
								>
									{link.label}
								</a>
							);
						}
						const active = () => currentView().id === link.id;
						return (
							<button
								class={`mobile-link ${active() ? 'active' : ''}`}
								onClick={() => go(link.id as any)}
							>
								{link.label}
							</button>
						);
					}}
				</For>
			</div>
		</header>
	);
}
