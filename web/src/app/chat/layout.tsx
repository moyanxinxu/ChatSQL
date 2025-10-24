"use client";
import { SideNav } from "@/components/nav/SideNav";
import { TopNav } from "@/components/nav/TopNav";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='agent flex h-full w-full flex-row'>
            <SideNav />
            <div className='agent-body flex h-full w-full flex-col'>
                <TopNav />
                {children}
            </div>
        </div>
    );
}
