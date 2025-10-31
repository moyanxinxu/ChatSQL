"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { authClient, signOut } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function Home() {
    const handleLogOut = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    toast.success("成功退出登陆!");

                    setTimeout(() => {
                        redirect("/auth/login");
                    }, 1000);
                },
            },
        });
    };

    return (
        <div className='flex h-full w-full flex-col justify-between p-2'>
            <div></div>

            <div>
                <Button onClick={handleLogOut}>
                    退出登陆
                    <LogOut />
                </Button>
            </div>
        </div>
    );
}
