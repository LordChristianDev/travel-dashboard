// @ts-nocheck
import { Link } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import NavItems from "./NavItems";

import logo from "/assets/icons/logo.png";
import menu from "/assets/icons/menu.svg";


const MobileSidebar = () => {
	let sidebar: SidebarComponent;

	const handleSidebarToggle = () => sidebar.toggle();
	const handleRef = (Sidebar) => sidebar = Sidebar;
	const handleCreated = () => sidebar.hide();

	return (
		<div className="mobile-sidebar wrapper">
			<header>
				{/* Logo */}
				<Link to="/">
					<img
						src={logo}
						alt="logo"
						className="w-[3rem]"
					/>

					<h1>Itinera</h1>
				</Link>

				<button onClick={handleSidebarToggle}>
					<img
						src={menu}
						alt="menu"
						className="size-[2rem]"
					/>
				</button>
			</header>

			<SidebarComponent
				width={270}
				ref={handleRef}
				created={handleCreated}
				closeOnDocumentClick={true}
				showBackdrop={true}
				type="over"
			>
				<NavItems handleClick={handleSidebarToggle} />
			</SidebarComponent>
		</div >
	)
}

export default MobileSidebar;
