"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Section (Image) */}
      <div className="flex-1 relative bg-[#161B22] flex justify-center items-center">
        <Image
          src="/images/login.png" // Path to the image
          alt="Example image"
          width={500} // Desired width
          height={300} // Desired height
        />
      </div>

      {/* Right Section (Form) */}
      <div className="flex-1 flex justify-center items-center bg-[#101317]">
        <motion.div
          className="w-full max-w-md p-8  rounded-xl shadow border-2 border-[#232B3A]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-semibold text-[#E5E7EB] mb-6 text-center">
            Log In
          </h2>

          <form className="space-y-6">
            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#A1A1AA]"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full mt-2 p-3 rounded-lg bg-[#0D1117] border border-[#2A3A4B] text-[#E5E7EB] focus:ring-2 focus:ring-[#16C784] focus:outline-none transition duration-200"
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#A1A1AA]"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full mt-2 p-3 rounded-lg bg-[#0D1117] border border-[#2A3A4B] text-[#E5E7EB] focus:ring-2 focus:ring-[#16C784] focus:outline-none transition duration-200"
              />
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#16C784] to-[#2ECC71] text-white font-semibold rounded-lg shadow-md hover:from-[#2ECC71] hover:to-[#28A745] transition duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Log In
            </motion.button>
          </form>

          {/* Sign-Up Link */}
          <div className="mt-6 text-center text-[#A1A1AA]">
            Don’t have an account?{" "}
            <Link
              href="/registration"
              className="text-sm font-semibold text-[#16C784] hover:text-[#28A745]"
            >
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
