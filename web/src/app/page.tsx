import Link from "next/link";
import { GitGraph, User } from "lucide-react";
import { LangGraph } from "@lobehub/icons";
import { NavigationMenu } from "@/components/ui/navigation-menu";

const navLinks = [
    {
        name: "智能体",
        href: "/chat",
    },
    {
        name: "知识图谱",
        href: "/graph",
    },
    {
        name: "知识库",
        href: "/database",
    },
    {
        name: "设置",
        href: "/settings",
    },
];

export default function Home() {
    return (
        <div className='flex h-screen flex-col'>
            <div className='glass-header flex items-center justify-between border-b px-2 py-1'>
                {/* logo区域 */}
                <div className='logo flex items-center gap-1'>
                    <LangGraph.Color />
                    <p>默言心绪</p>
                </div>

                {/* 导航区域 */}
                <div className='nav-links flex items-center gap-4'>
                    {navLinks.map((item) => (
                        <Link key={item.name} href={item.href}>
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* 导航按钮区域 */}
                <div className='header-actions flex items-center gap-1'>
                    <a href='https://github.com/xerrors/Yuxi-Know'>
                        <GitGraph />
                    </a>
                    <a href='#'>
                        <User />
                    </a>
                </div>
            </div>

            {/* hero部分 */}
            <div className='hero-content flex flex-1 flex-col items-center justify-center'>
                <h1 className='title justify-between text-2xl'>与SQL对话</h1>
                <Link
                    className='start-chat inline items-center rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800'
                    href='/chat/'>
                    开始对话
                </Link>
            </div>
        </div>
    );
}
