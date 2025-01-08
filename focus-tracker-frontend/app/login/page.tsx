"use client";

import { usePostData } from "@/hooks/useApi";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";

interface FormData {
  email: string;
  password: string;
}

interface ResponseData {
  message: string;
  token: string;
  user: {
    name: string;
    email: string;
  };
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate, isPending } = usePostData<FormData, ResponseData>(
    "/api/auth/login"
  );

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      mutate(data, {
        onSuccess: (response) => {
          const { message, token, user } = response;

          toast.success(`${message}. Redirecting...`);
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          setTimeout(() => {
            router.push("/");
          }, 1000);
        },
        onError: () => {
          setErrorMessage("Login failed. Check Email and Password again!");
        },
      });
    } catch {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  // Validation Rules
  const emailValidation = {
    required: "Email is required",
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: "Invalid email address",
    },
  };

  const passwordValidation = {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters long",
    },
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 relative bg-[#161B22] flex justify-center items-center">
        <Image src="/images/login.png" alt="Login" width={500} height={300} />
      </div>
      <div className="flex-1 flex justify-center items-center bg-[#101317]">
        <motion.div
          className="w-full max-w-md p-8 rounded-xl shadow border-2 border-[#232B3A]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-semibold text-[#E5E7EB] mb-6 text-center">
            Log In
          </h2>

          {errorMessage && (
            <div className="mb-4 text-center text-red-500">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                disabled={isPending}
                placeholder="Enter your email"
                className="w-full mt-2 p-3 rounded-lg bg-[#0D1117] border border-[#2A3A4B] text-[#E5E7EB] focus:ring-2 focus:ring-[#16C784] focus:outline-none transition duration-200"
                {...register("email", emailValidation)}
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
                disabled={isPending}
                placeholder="Enter your password"
                className="w-full mt-2 p-3 rounded-lg bg-[#0D1117] border border-[#2A3A4B] text-[#E5E7EB] focus:ring-2 focus:ring-[#16C784] focus:outline-none transition duration-200"
                {...register("password", passwordValidation)}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <motion.button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#16C784] to-[#2ECC71] text-white font-semibold rounded-lg shadow-md hover:from-[#2ECC71] hover:to-[#28A745] transition duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isPending}
            >
              {isPending ? "Logging In..." : "Log In"}
            </motion.button>
          </form>

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
      <Toaster />
    </div>
  );
}
