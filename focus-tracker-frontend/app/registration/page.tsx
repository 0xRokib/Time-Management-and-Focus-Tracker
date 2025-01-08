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
  name: string;
  email: string;
  password: string;
}
interface ResponseData {
  message: string;
  token: string;
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate, isPending } = usePostData<FormData, ResponseData>(
    "/api/auth/register"
  );

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    console.log(data);
    try {
      mutate(data, {
        onSuccess: (response) => {
          const { message } = response;
          toast.success(`${message}. Please login.`);
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        },
        onError: () => {
          setErrorMessage("Registration failed. Please try again.");
        },
      });
    } catch {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  // Validation Rules
  const nameValidation = {
    required: "Full name is required",
    minLength: {
      value: 3,
      message: "Full name must be at least 3 characters long",
    },
    pattern: {
      value: /^[A-Za-z\s]+$/,
      message: "Full name can only contain letters and spaces",
    },
  };

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
    pattern: {
      value:
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&_\?])[A-Za-z\d@$!%*?&_\?]{8,}$/,
      message:
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 relative bg-[#161B22] flex justify-center items-center">
        <Image
          src="/images/registration.png"
          alt="Register"
          width={500}
          height={300}
        />
      </div>
      <div className="flex-1 flex justify-center items-center bg-[#101317] ">
        <motion.div
          className="w-full max-w-md p-8 rounded-xl shadow border-2 border-[#232B3A]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-semibold text-[#E5E7EB] mb-6 text-center">
            Sign Up
          </h2>

          {errorMessage && (
            <div className="mb-4 text-center text-red-500">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                disabled={isPending}
                placeholder="Enter your full name"
                className="w-full mt-2 p-3 rounded-lg bg-[#0D1117] border border-[#2A3A4B] text-[#E5E7EB] focus:ring-2 focus:ring-[#16C784] focus:outline-none transition duration-200"
                {...register("name", nameValidation)}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name.message}
                </p>
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
              {isPending ? "Signing Up..." : "Sign Up"}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-[#A1A1AA]">
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
      <Toaster />
    </div>
  );
}
