"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion"; // For animations
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { registerUser } from "@/features/user/userSlice";

const Register = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const router = useRouter();
  const dispatch = useDispatch();
  const password = watch("password");

  const { loading, error, user } = useSelector((state) => state.user);

  const onSubmit = async (data) => {
    dispatch(registerUser(data))
      .unwrap()
      .then((response) => {
        if (response.message === "User registered successfully") {
          toast.success("Registration successful");
          reset();
        } else {
          toast.error(response.message);
        }
      })
      .catch((err) => {
        toast.error(err.message || "Registration failed");
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center items-center min-h-screen bg-gray-100"
    >
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Sign Up
        </h1>

        {/* Social Media Buttons */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-between space-x-2 mb-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center border border-gray-300 rounded-full py-2 px-4 hover:border-[#074c77] active:opacity-40"
          >
            <FaFacebook className="text-blue-600 mr-2 text-xl" />
            Facebook
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center border border-gray-300 rounded-full py-2 px-4 hover:border-[#074c77] active:opacity-40"
          >
            <FaApple className="text-black mr-2 text-xl" />
            Apple
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center border border-gray-300 rounded-full py-2 px-4 hover:border-[#074c77] active:opacity-40"
          >
            <FcGoogle className="text-red-500 mr-2 text-xl" />
            Google
          </motion.button>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center my-4"
        >
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </motion.div>

        {/* Form for Registration Fields */}
        <motion.form
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3"
        >
          {/* Full Name Field */}
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{
              required: "Full Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Your full name"
                className={`w-full border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          {/* Email Field */}
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="Your email"
                className={`w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* Password Field */}
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                placeholder="Your password"
                className={`w-full border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* Confirm Password Field */}
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            rules={{
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                placeholder="Confirm password"
                className={`w-full border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}

          {/* Description Field */}
          <Controller
            name="description"
            control={control}
            defaultValue=""
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Description"
                className={`w-full border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          {/* Country Field */}
          <Controller
            name="country"
            control={control}
            defaultValue=""
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Country"
                className={`w-full border ${
                  errors.country ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}

          {/* Speaks Field */}
          <Controller
            name="speaks"
            control={control}
            defaultValue=""
            rules={{ required: "Speaks is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Speaks (comma-separated)"
                className={`w-full border ${
                  errors.speaks ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.speaks && (
            <p className="text-red-500 text-sm">{errors.speaks.message}</p>
          )}

          {/* Learns Field */}
          <Controller
            name="learns"
            control={control}
            defaultValue=""
            rules={{ required: "Learns is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Learns (comma-separated)"
                className={`w-full border ${
                  errors.learns ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.learns && (
            <p className="text-red-500 text-sm">{errors.learns.message}</p>
          )}

          {/* Image Field */}
          <Controller
            name="image"
            control={control}
            defaultValue=""
            rules={{ required: "Image is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Image URL"
                className={`w-full border ${
                  errors.image ? "border-red-500" : "border-gray-300"
                } rounded-lg p-3 focus:outline-none focus:border-blue-500`}
              />
            )}
          />
          {errors.image && (
            <p className="text-red-500 text-sm">{errors.image.message}</p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-[#074c77] text-white py-3 rounded-lg font-semibold hover:bg-cyan-600 transition duration-200"
            disabled={loading || Object.keys(errors).length > 0} // Disable button while loading
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>
        </motion.form>

        {/* Already have an account */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-4"
        >
          <Link href="/login" className="text-sm text-gray-600 hover:underline">
            Already have an account? Log in
          </Link>
        </motion.div>

        {/* Display user name if user is logged in */}
        {user && <p>Welcome, {user.name}!</p>}
      </motion.div>
    </motion.div>
  );
};

export default Register;
