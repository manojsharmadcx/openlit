import asaw from "@/utils/asaw";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const errors = {
	Signin: "Try signing with a different account.",
	OAuthSignin: "Try signing with a different account.",
	OAuthCallback: "Try signing with a different account.",
	OAuthCreateAccount: "Try signing with a different account.",
	EmailCreateAccount: "Try signing with a different account.",
	Callback: "Try signing with a different account.",
	OAuthAccountNotLinked:
		"To confirm your identity, sign in with the same account you used originally.",
	EmailSignin: "Check your email address.",
	CredentialsSignin:
		"Sign in failed. Check the details you provided are correct.",
	default: "Unable to sign in.",
};

const SignInError = ({ error }: { error: keyof typeof errors }) => {
	const errorMessage = error && (errors[error] ?? errors.default);
	return <div className="text-xs text-red-600 text-center">{errorMessage}</div>;
};

export function AuthForm({ type }: { type: "login" | "register" }) {
	const [error, setError] = useState<string>("");
	async function authWrapper(fn: any) {
		const [err, response] = await asaw(fn());

		if (err) {
			setError(err.toString());
			return;
		}

		if (!response.ok) {
			setError(response.error);
			return;
		}

		window.location.replace("/dashboard");
	}
	async function login(formData: FormData) {
		authWrapper(() =>
			signIn("login", {
				callbackUrl: "/dashboard",
				email: formData.get("email") as string,
				password: formData.get("password") as string,
				redirect: false,
			})
		);
	}

	async function register(formData: FormData) {
		authWrapper(() =>
			signIn("register", {
				callbackUrl: "/dashboard",
				email: formData.get("email") as string,
				password: formData.get("password") as string,
				redirect: false,
			})
		);
	}

	return (
		<div className="flex h-screen w-screen items-center justify-center">
			<div className="z-10 w-full max-w-md overflow-hidden rounded-2xl shadow-xl">
				<div className="flex flex-col items-center justify-center space-y-3 px-4 py-6 pt-8 text-center sm:px-16">
					<h3 className="text-xl font-semibold">
						{type === "login" ? "Sign In" : "Sign Up"}
					</h3>
					<p className="text-sm">
						{type === "login"
							? "Use your email and password to sign in"
							: "Create an account to enter"}
					</p>
				</div>
				{error && <SignInError error={error as keyof typeof errors} />}
				<form
					action={type === "login" ? login : register}
					className="flex flex-col space-y-4 px-4 py-8 sm:px-16 text-gray-900"
				>
					<div className="flex flex-col w-full items-start">
						<label htmlFor="email" className="block text-xs uppercase">
							Email Address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							placeholder="user@acme.com"
							autoComplete="email"
							required
							className="mt-1 block w-full appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
						/>
					</div>
					<div className="flex flex-col w-full items-start">
						<label
							htmlFor="password"
							className="block text-xs dark:text-gray-200 uppercase"
						>
							Password
						</label>
						<input
							autoComplete="current-password"
							id="password"
							name="password"
							type="password"
							required
							className="mt-1 block w-full appearance-none border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
						/>
					</div>
					{type === "login" ? (
						<button type="submit" className="p-3">
							Sign in
						</button>
					) : (
						<button type="submit" className="p-3">
							Sign Up
						</button>
					)}
					<p className="text-center text-sm text-gray-600">
						{type === "login"
							? "Don't have an account? "
							: "Already have an account?"}
						<Link
							href={type === "login" ? "/register" : "/login"}
							className="font-semibold text-gray-600"
						>
							{type === "login" ? " Sign up" : " Sign in"}
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
