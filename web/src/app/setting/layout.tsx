import { SideNav } from "@/components/nav/SideNav";
import { Toaster } from "@/components/ui/sonner"

export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-row h-full w-full">
        <SideNav />

        <div className="flex w-full h-full">
            {children}
        </div>

        <Toaster />
    </div>;
}