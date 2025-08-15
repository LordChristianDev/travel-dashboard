import { Link, redirect } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

import logo from "/assets/icons/logo.png";
import google from "/assets/icons/google.svg";

export async function clientLoader() {
	try {
		const user = await account.get();
		if (user.$id) {
			return redirect('/');
		}
	} catch (error) {
		return null;
	}
}

const SignIn = () => {
	const handleSignIn = async () => await loginWithGoogle();

	return (
		<main className="auth">
			<section className="px-6 size-full glassmorphism flex-center">
				<div className="sign-in-card">
					{/* Top Logo */}
					<header className="header ">
						<Link to='/'>
							<img
								src={logo}
								alt="logo"
								className="w-[4rem]"
							/>
						</Link>

						<h1 className="p-28-bold text-dark-100">Itinera</h1>
					</header>

					<article>
						<h2 className="p-28-semibold text-dark-100 text-center"> Start Your Travel Journey</h2>
						<p className="p-18-regular text-center text-gray-100 !leading-7">Sign in with Google to manage destinations, itineraries, and user activity with ease.</p>
					</article>

					{/* Sign in Button */}
					<ButtonComponent
						type="button"
						iconCss="e-search-icon"
						onClick={handleSignIn}
						className="button-class !h-11 !w-full"
					>
						<img
							src={google}
							alt="google"
							className="size-5"
						/>

						<span className="p-18-semibold text-white"> Sign in with Google</span>
					</ButtonComponent>
				</div>
			</section>
		</main >
	);
}

export default SignIn;
