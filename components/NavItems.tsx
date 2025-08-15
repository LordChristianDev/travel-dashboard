import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { sidebarItems } from "~/constants";
import { cn } from "~/lib/utils";

// Images
import logo from "/assets/icons/logo.png";
import logout from "/assets/icons/logout.svg";
import profile from '/assets/images/david.webp';
import { logoutUser } from "~/appwrite/auth";

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
	const user = useLoaderData();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logoutUser();
		navigate('/sign-in');
	}

	const renderNavItems = sidebarItems.map((item) => {
		const { id, icon, label, href } = item;

		const handleCallback = ({ isActive }: { isActive: boolean }) => {
			return (
				<div className={cn(
					'group nav-item',
					{ 'bg-primary-100 !text-white': isActive }
				)}
					onClick={handleClick}
				>
					<img
						src={icon}
						alt={label}
						className={cn(
							'group-hover:brightness-0 size-0 group-hover:invert',
							isActive ? 'brightness-0 invert' : 'text-dark-200'
						)}
					/>
					{label}
				</div>
			);
		}

		return (
			<NavLink key={id} to={href}>{handleCallback}</NavLink>
		);
	});

	return (
		<section className="nav-items">
			{/* Logo */}
			<Link
				to='/'
				className="link-logo"
			>
				<img
					src={logo}
					alt="logo"
					className="w-[4rem]"
				/>

				<h1>Itinera</h1>
			</Link>

			{/* Navigation Bar Content */}
			<div className="container">
				<nav>
					{renderNavItems}
				</nav>

				{/* Navigation Bar Footer  */}
				<footer className="nav-footer">
					<img
						src={user?.imageUrl || profile}
						alt={user.name || 'David'}
						referrerPolicy="no-referrer"
					/>

					<article>
						<h2>{user?.name}</h2>
						<p>{user?.email}</p>
					</article>

					<button
						onClick={handleLogout}
						className="cursor-pointer"
					>
						<img
							src={logout}
							alt="logout"
						/>
					</button>
				</footer>
			</div>
		</section>
	)
}

export default NavItems;
