import { createSignal, For } from 'solid-js';
import ThemeToggle from './ThemeToggle';
import { currentView, nav } from '../nav';
import './Navbar.scss';

export default function Navbar() {
	const [mobileOpen, setMobileOpen] = createSignal(false);

	const navLinks = [
		{ id: 'home', label: 'Home' },
		{ id: 'blog', label: 'Blog' },
		{ id: 'about', label: 'About' },
		{ id: 'resume', label: 'Resume' }
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
							const active = () => {
								const current = currentView();
								return current.id === link.id || (link.id === 'blog' && current.id === 'post');
							};
							return (
								<button
									class={`nav-link ${active() ? 'active' : ''}`}
									onClick={() => go(link.id)}
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
						const active = () => currentView().id === link.id;
						return (
							<button
								class={`mobile-link ${active() ? 'active' : ''}`}
								onClick={() => go(link.id)}
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
