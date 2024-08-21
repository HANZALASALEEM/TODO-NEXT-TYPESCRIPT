"use client";
import Image from "next/image";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  const handleSignIn = () => {
    router.push("/signIn");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-3/4 h-3/4 lg:w-1/3">
        {/* container */}
        <div className="py-6 px-4 border-2 border-gray-300 rounded-xl my-2">
          <h1 className="text-2xl mb-2 font-semibold">Forget Password</h1>

          <form className="flex flex-col">
            <label className="text-sm font-semibold py-1">Email</label>
            <input
              type="email"
              name="email"
              className="rounded-sm border-2"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="bg-yellow-500 my-2 text-sm py-1 rounded-sm"
              type="submit"
            >
              Continue
            </button>
          </form>
        </div>
        {/* line Saperator */}
        <div className="w-full my-3 flex flex-row items-center justify-between">
          <div className="w-1/4 h-0.5 bg-gray-400 rounded-xl"></div>
          <div className="w-2/4">
            <p className="text-sm text-center">Back to Sign In</p>
          </div>
          <div className="w-1/4 h-0.5 bg-gray-400 rounded-xl"></div>
        </div>
        {/* Sign In Button */}
        <div className="w-full">
          <button
            className="bg-white border-gray-400 border-2 rounded-xl my-2 text-sm py-1 rounded-sm w-full"
            onClick={handleSignIn}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
