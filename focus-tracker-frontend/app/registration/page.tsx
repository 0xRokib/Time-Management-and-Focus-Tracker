"use client";

import { usePostData } from "@/hooks/useApi";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate, isPending } = usePostData<FormData, { message: string }>(
    "/api/register"
  );

  const router = useRouter(); // Initialize router from next/navigation

  const onSubmit = async (data: FormData) => {
    console.log(data);
    try {
      mutate(data, {
        onSuccess: (response: unknown) => {
          console.log("Registration successful:", response);
          router.push("/login"); // Navigate to home after successful registration
        },
        onError: (err: unknown) => {
          console.error("Registration error:", err);
          setErrorMessage("Registration failed. Please try again.");
        },
      });
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#111827] p-4">
      <motion.div
        className="w-full max-w-md p-8 bg-[#1F2937] rounded-xl shadow-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-semibold text-[#E5E7EB] mb-4 text-center">
          Sign Up
        </h2>

        {errorMessage && (
          <div className="mb-4 text-center text-red-500">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-[#A1A1AA]"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              className="w-full mt-2 p-3 rounded-lg bg-[#232B3A] border border-[#2A3A4B] text-[#E5E7EB] focus:ring-2 focus:ring-[#16C784]"
              {...register("name", { required: "Full name is required" })}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

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
              className="w-full mt-2 p-3 rounded-lg bg-[#232B3A] border border-[#2A3A4B] text-[#E5E7EB] focus:ring-2 focus:ring-[#16C784]"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

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
              className="w-full mt-2 p-3 rounded-lg bg-[#232B3A] border border-[#2A3A4B] text-[#E5E7EB] focus:ring-2 focus:ring-[#16C784]"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <motion.button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#16C784] to-[#2ECC71] text-white font-semibold rounded-lg shadow-md hover:from-[#2ECC71] hover:to-[#28A745]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              disabled={isPending}
            >
              {isPending ? "Signing Up..." : "Sign Up"}
            </motion.button>
          </div>
        </form>

        <div className="mt-4 text-center text-[#A1A1AA]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-sm font-semibold text-[#16C784] hover:text-[#28A745]"
          >
            Log in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
