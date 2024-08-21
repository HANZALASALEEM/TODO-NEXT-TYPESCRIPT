"use client";
import Image from "next/image";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const signInUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const signInData = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });
    if (signInData) {
      router.push("/home");
    }
  };

  const handleSignUp = () => {
    router.push("/");
  };

  const googleSignIn = async () => {
    await signIn("google", {
      callbackUrl: "/home",
      redirect: false,
    });
  };

  const githubSignIn = async () => {
    await signIn("github", {
      callbackUrl: "/home",
      redirect: false,
    });
  };

  const handleForgetPassword = () => {
    router.push("/forgetPassword");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-3/4 h-3/4 lg:w-1/3">
        {/* container */}
        <div className="py-6 px-4 border-2 border-gray-300 rounded-xl my-2">
          <h1 className="text-2xl mb-2 font-semibold">Sign In</h1>

          <form className="flex flex-col" onSubmit={signInUser}>
            <label className="text-sm font-semibold py-1">Email</label>
            <input
              type="email"
              name="email"
              className="rounded-sm border-2"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="text-sm font-semibold py-1">Password</label>
            <input
              type="password"
              name="password"
              className="rounded-sm border-2"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="bg-yellow-500 my-2 text-sm py-1 rounded-sm"
              type="submit"
            >
              Continue
            </button>
          </form>
          <button
            className="w-full flex justify-end"
            onClick={handleForgetPassword}
          >
            <p className="text-sm underline text-blue-700">forget password</p>
          </button>
        </div>
        {/* line Saperator */}
        <div className="w-full my-3 flex flex-row items-center justify-between">
          <div className="w-1/4 h-0.5 bg-gray-400 rounded-xl"></div>
          <div className="w-2/4">
            <p className="text-sm text-center">Create new Account</p>
          </div>
          <div className="w-1/4 h-0.5 bg-gray-400 rounded-xl"></div>
        </div>
        {/* Sign In Button */}
        <div className="w-full">
          <button
            className="bg-white border-gray-400 border-2 rounded-xl my-2 text-sm py-1 rounded-sm w-full"
            onClick={handleSignUp}
          >
            Sign Up
          </button>
        </div>
        {/* Sign In with Google Button */}
        <div className="w-full">
          <button
            className="bg-white flex items-center justify-center border-gray-400 border-2 rounded-xl my-2 text-sm py-1 rounded-sm w-full"
            onClick={googleSignIn}
          >
            <Image
              src="/images/gogle.png"
              alt="google"
              width={20}
              height={20}
              className="mx-3"
            />
            Sign In with Google
          </button>
        </div>
        {/* Sign In with Git Hub Button */}
        <div className="w-full">
          <button
            className="bg-white flex items-center justify-center border-gray-400 border-2 rounded-xl my-2 text-sm py-1 rounded-sm w-full"
            onClick={githubSignIn}
          >
            <Image
              src="/images/github.png"
              alt="google"
              width={20}
              height={20}
              className="mx-3"
            />
            Sign In with GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
