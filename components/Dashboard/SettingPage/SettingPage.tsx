/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/UseAxiosPrivate";

type FormValues = {
    first_name: string;
    last_name: string;
    email: string;
    current_password: string;
    new_password: string;
    confirm_password: string;
    image: string | null; // base64 string or URL
};

export default function Settings() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const axiosPrivate = useAxiosPrivate()

    const { data: user, refetch } = useQuery({
        queryKey: ['all-user'],
        queryFn: async () => {
            const res = await axiosPrivate.get('/auth/me')
            return res.data
        }
    })

    // console.log(user?.data)

    const {
        register,
        handleSubmit,
        // watch,
        reset,
        setValue,
        formState: { isSubmitting },
    } = useForm<FormValues>({

    });

    useEffect(() => {
        if (user?.data) {
            reset({
                first_name: user.data.first_name || "",
                last_name: user.data.last_name || "",
                email: user.data.email || "",
                current_password: "",
                new_password: "",
                confirm_password: "",
                image: null,
            });
        }
    }, [user, reset]);

    // const newPassword = watch("new_password");
    // const confirmPassword = watch("confirm_password");

    const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setProfilePhoto(file);
        setPreview(URL.createObjectURL(file));
    };


    const handleDeletePhoto = () => {
        setProfilePhoto(null);
        setPreview(null);
    };


    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const formData = new FormData();

            formData.append("first_name", data.first_name);
            formData.append("last_name", data.last_name);
            formData.append("email", data.email);

            if (data.current_password) {
                formData.append("current_password", data.current_password);
            }

            if (data.new_password) {
                formData.append("new_password", data.new_password);
            }

            // THIS IS THE KEY LINE
            if (profilePhoto) {
                console.log(profilePhoto)
                formData.append("image", profilePhoto);
            }

            const result = await axiosPrivate.patch("/auth/update", formData);

            if (result?.data?.success) {
                toast.success(result?.data?.message)
                refetch();
            }
        } catch (error: any) {
            // toast({
            //     title: "Update failed",
            //     description:
            //         error?.response?.data?.message || "Something went wrong",
            //     variant: "destructive",
            // });
        }
    };


    const imageSrc =
        preview ||
        user?.data?.avatar_url ||
        "/default-avatar.png";


    return (
        <div className="min-h-screen p-5 bg-[#FFFEFA]">
            <div className="w-full border bg-[#FFF] border-[#F5F5F7] rounded-md">
                <div className="p-4 lg:p-8">
                    <div>
                        <div className="text-neutral-900 font-sf-pro-display text-[20px] font-medium leading-[1.2] tracking-[0.1px]">
                            Edit admin info
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex items-center gap-3 md:gap-4 mt-5">
                            <div>
                                <Image
                                    src={imageSrc}
                                    alt="Profile Photo"
                                    height={100}
                                    width={100}
                                    className="w-12 h-12 rounded-full object-cover"
                                />

                            </div>
                            <div className="flex gap-2 md:gap-4">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-[#1D1F2C] text-center  text-[12px] md:text-base font-medium leading-[1.6] tracking-[0.08px] py-2 px-2 md:px-5 bg-[#F5F5F7] rounded-[8px] cursor-pointer"
                                    type="button"
                                >
                                    + Upload photo
                                </button>
                                {profilePhoto && (
                                    <button
                                        onClick={handleDeletePhoto}
                                        className="text-[#1D1F2C] text-center  text-[12px] md:text-base font-medium leading-[1.6] tracking-[0.08px] py-2 px-2  md:px-5 bg-[#F5F5F7] rounded-[8px] cursor-pointer"
                                        type="button"
                                    >
                                        Delete photo
                                    </button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                name="image"
                                onChange={onPhotoChange}
                                className="hidden"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 ">
                                <div className="space-y-2">
                                    <label className="text-[#4A4C56] font-sf-pro-display text-[16px] font-medium leading-[1.6] tracking-[0.08px]">
                                        First name
                                    </label>
                                    <Input
                                        className="mt-2 py-2 h-[48px] px-[14px]  focus:ring-0 focus:outline-none !ring-0 !outline-none  text-[16px] font-normal leading-[1.6] tracking-[0.08px]"
                                        defaultValue={user?.data?.first_name}
                                        placeholder="Enter Your First name"
                                        {...register("first_name")}
                                    />
                                    {/* {errors.first_name && (
                                        <p className="text-red-500 text-sm">{errors.first_name.message}</p>
                                    )} */}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[#4A4C56] font-sf-pro-display text-[16px] font-medium leading-[1.6] tracking-[0.08px]">
                                        Last name
                                    </label>
                                    <Input
                                        className="mt-2 py-2 h-[48px] px-[14px]  focus:ring-0 focus:outline-none !ring-0 !outline-none  text-[16px] font-normal leading-[1.6] tracking-[0.08px]"
                                        defaultValue={user?.data?.last_name}
                                        placeholder="Enter Your Last Name"
                                        {...register("last_name")}
                                    />
                                    {/* {errors.last_name && (
                                        <p className="text-red-500 text-sm">{errors.last_name.message}</p>
                                    )} */}
                                </div>
                            </div>
                            <div className="space-y-2 mt-4">
                                <label className="text-[#4A4C56] font-sf-pro-display text-[16px] font-medium leading-[1.6] tracking-[0.08px]">
                                    Email
                                </label>
                                <Input
                                    className="mt-2 py-2 h-[48px] px-[14px]  focus:ring-0 focus:outline-none !ring-0 !outline-none  text-[16px] font-normal leading-[1.6] tracking-[0.08px]"
                                    type="email"
                                    disabled
                                    defaultValue={user?.data?.email}
                                    placeholder="Enter Your Email"
                                    {...register("email", {

                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                />
                                {/* {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>} */}
                            </div>
                        </div>

                        <div className="mt-12 mb-8">
                            <div className="text-[#1F2937] font-sf-pro-display text-[20px] font-medium leading-[1.2] tracking-[0.1px]">
                                Password Update
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[#4A4C56] text-[16px] font-medium leading-[1.6] tracking-[0.08px]">
                                    Current Password
                                </label>
                                <Input
                                    className="mt-2 py-2 h-[48px] px-[14px]  focus:ring-0 focus:outline-none !ring-0 !outline-none  text-[16px] font-normal leading-[1.6] tracking-[0.08px]"

                                    type="password"
                                    placeholder="Enter Your Current Password"
                                    {...register("current_password")}
                                />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[#4A4C56] font-sf-pro-display text-[16px] font-medium leading-[1.6] tracking-[0.08px]">
                                        New Password
                                    </label>
                                    <Input
                                        className="mt-2 py-2 h-[48px] px-[14px]  focus:ring-0 focus:outline-none !ring-0 !outline-none  text-[16px] font-normal leading-[1.6] tracking-[0.08px]"

                                        type="password"
                                        placeholder="Enter Your New Password"
                                        {...register("new_password")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[#4A4C56] font-sf-pro-display text-[16px] font-medium leading-[1.6] tracking-[0.08px]">
                                        Confirm Password
                                    </label>
                                    <Input
                                        className="mt-2 py-2 h-[48px] px-[14px]  focus:ring-0 focus:outline-none !ring-0 !outline-none  text-[16px] font-normal leading-[1.6] tracking-[0.08px]"

                                        type="password"
                                        placeholder="Enter Your Confirm Password"
                                        {...register("confirm_password")}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#C6A664] text-white mt-5 py-3 px-4 rounded-[12px] cursor-pointer"
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>

            {/* <Toaster toasts={toasts} /> */}
        </div>
    );
}
