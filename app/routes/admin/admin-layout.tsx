import { Outlet, redirect } from "react-router";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import { account } from "~/appwrite/client";

import { NavItems, MobileSidebar } from "../../../components";
import { getExistingUser, storeUserData } from "~/appwrite/auth";

export async function clientLoader() {
	try {
		const user = await account.get();

		if (!user) return redirect('/sign-in');

		const existingUser = await getExistingUser(user.$id);

		if (existingUser?.status === 'user') {
			return redirect('/');
		}

		return existingUser?.$id ? existingUser : await storeUserData();
	} catch (e) {
		console.error('Error in clientLoader', e);
		return redirect('/sign-in');
	}
}

const AdminLayout = () => {
	return (
		<div className="admin-layout">
			{/* Mobile Sidebar */}
			<MobileSidebar />

			{/* Desktop Sidebar */}
			<aside className="hidden lg:block max-w-[250px] w-full">
				<SidebarComponent width={250} enableGestures={false}>
					<NavItems />
				</SidebarComponent>
			</aside>

			{/* Main Content */}
			<aside className="children">
				<Outlet />
			</aside>
		</div>
	);
}

export default AdminLayout;