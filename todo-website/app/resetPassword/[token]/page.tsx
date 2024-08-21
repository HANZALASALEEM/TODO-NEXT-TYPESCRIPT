"use client";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

interface PageParams {
  token: string;
}

interface PageProps {
  params: PageParams;
}

const Page: React.FC<PageProps> = ({ params }) => {
  const router = useRouter();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const resetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const response = await fetch("/api/resetPassword", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, token: params.token }),
        });
        if (response.status === 200) {
          alert("Password reset in database");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      alert("Password and Confirm Password must be same");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="w-3/4 h-3/4 lg:w-1/3">
        {/* container */}
        <div className="py-6 px-4 border-2 border-gray-300 rounded-xl my-2">
          <h1 className="text-2xl mb-2 font-semibold">Reset Password</h1>

          <form className="flex flex-col" onSubmit={resetPassword}>
            <label className="text-sm font-semibold py-1">Password</label>
            <input
              type="password"
              name="password"
              className="rounded-sm border-2"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="text-sm font-semibold py-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm-password"
              className="rounded-sm border-2"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="bg-yellow-500 my-2 text-sm py-1 rounded-sm"
              type="submit"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
