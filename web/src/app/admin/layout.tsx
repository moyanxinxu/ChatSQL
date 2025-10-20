"use client";
import { DashTopNav } from "@/components/nav/TopNav";
import { SideNav } from "@/components/nav/SideNav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='admin flex h-full w-full flex-row'>
            <div className='flex'>
                <SideNav />
            </div>
            <div className='flex h-full w-full flex-col'>
                <DashTopNav />
                <div className='h-full w-full overflow-y-scroll'>
                    {children}
                </div>
            </div>
        </div>
    );
}
