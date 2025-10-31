"use client";
import { DashTopNav } from "@/components/nav/TopNav";
import { SideNav } from "@/components/nav/SideNav";
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='admin flex h-full w-full flex-row'>
            <div className='flex'>
                <SideNav />
            </div>
            <div className='flex h-full w-full flex-col'>
                <DashTopNav />
                <div className='h-full w-full overflow-y-scroll p-2'>
                    {children}
                </div>
            </div>

            <Toaster richColors />
        </div>
    );
}
