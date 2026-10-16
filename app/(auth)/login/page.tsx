"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
import { toast } from "sonner";
import SetCookies from "@/hooks/token";
import { Spinner } from "@/components/Reusable/Loading";


interface LoginFormInputs {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
const axiosPrivate = useAxiosPrivate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);

    try {
      const res = await axiosPrivate.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      console.log(res?.data);

      if (res?.data?.success) {
        SetCookies(
          res?.data?.authorization?.access_token,
          res?.data?.type
        );
        if (res?.data?.type === "admin") {
          toast.success(res?.data?.message || "Login successfully");
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      } else {
        const errorData = res?.data;
        const msg =
          typeof errorData?.message === "string"
            ? errorData.message
            : errorData?.message?.message || "Login failed";
        toast.error(msg);
      }
    
    } catch (error: any) {
      console.error("Login error:", error.response || error);
      const resData = error.response?.data;
      let msg = "Login failed";
      if (typeof resData?.message === "string") {
        msg = resData.message;
      } else if (typeof resData?.message?.message === "string") {
        msg = resData.message.message;
      } else if (typeof resData?.error === "string") {
        msg = resData.error;
      } else if (error?.message) {
        msg = error.message;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFEFA]">
      <div className="w-full max-w-md bg-white rounded-2xl border p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 pb-6">
          Admin Dashboard Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <label className="text-sm text-gray-600 absolute bg-white left-4 -top-2 px-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 border border-[#DCDFD3] rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-200"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm text-gray-600 absolute bg-white left-4 -top-2 px-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full mt-1 px-4 py-2 border border-[#DCDFD3] rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-200"
              {...register("password", { required: "Password is required" })}
            />
            <div
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-[#C6A664] hover:bg-[#B39353] text-white py-3 rounded-full font-semibold transition-all flex items-center justify-center cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" color="#ffffff" className="mr-2" />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Optional Demo Info */}
        <p className="text-center text-sm text-gray-500 pt-4">
          Use your admin credentials to login.
        </p>
      </div>
    </div>
  );
}





// "use client";
// import axios from "axios";
// import { Eye, EyeOff } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import useAxiosPrivate from "@/hooks/UseAxiosPrivate";
// import { toast } from "sonner";
// import SetCookies from "@/hooks/token";


// interface LoginFormInputs {
//   email: string;
//   password: string;
// }

// export default function AdminLogin() {
//   const router = useRouter();
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
// const axiosPrivate = useAxiosPrivate();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormInputs>();

//   const onSubmit = async (data: LoginFormInputs) => {
//     setLoading(true);

//     try {
//       const res = await axiosPrivate.post("/auth/login", {
//         email: data.email,
//         password: data.password,
//       });

//       if (res?.data?.success) {
//         SetCookies(
//           res?.data?.authorization?.access_token,
//           res?.data?.type
//         );

//         if (res?.data?.type === "admin") {
//           toast.success(res?.data?.message || "Login successfully");
//           router.push("/dashboard");
//         } else {
//           router.push("/");
//         }
//       }

//     } catch (error: unknown) {

//       if (axios.isAxiosError(error)) {
//         toast.error(
//           error.response?.data?.message || "Login failed"
//         );
//       } else if (error instanceof Error) {
//         toast.error(error.message);
//       } else {
//         toast.error("Something went wrong");
//       }

//     } finally {
//       setLoading(false);
//     }
//   };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#FFFEFA]">
//       <div className="w-full max-w-md bg-white rounded-2xl border p-8 shadow-lg">
//         <h2 className="text-2xl font-bold text-center text-gray-900 pb-6">
//           Admin Dashboard Login
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
       
//           <div className="relative">
//             <label className="text-sm text-gray-600 absolute bg-white left-4 -top-2 px-2">
//               Email Address
//             </label>
//             <input
//               type="email"
//               className="w-full mt-1 px-4 py-2 border border-[#DCDFD3] rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-200"
//               {...register("email", { required: "Email is required" })}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
//             )}
//           </div>

       
//           <div className="relative">
//             <label className="text-sm text-gray-600 absolute bg-white left-4 -top-2 px-2">
//               Password
//             </label>
//             <input
//               type={showPassword ? "text" : "password"}
//               className="w-full mt-1 px-4 py-2 border border-[#DCDFD3] rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-200"
//               {...register("password", { required: "Password is required" })}
//             />
//             <div
//               className="absolute right-3 top-3 cursor-pointer text-gray-400"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
//             )}
//           </div>

//           <Button
//             type="submit"
//             className="w-full bg-[#C6A664] text-white py-3 rounded-full font-semibold transition-all"
//             disabled={loading}
//           >
//             {loading ? "Signing in..." : "Sign In"}
//           </Button>
//         </form>

      
//         <p className="text-center text-sm text-gray-500 pt-4">
//           Use your admin credentials to login.
//         </p>
//       </div>
//     </div>
//   );
// }

