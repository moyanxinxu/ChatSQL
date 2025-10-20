import Link from "next/link";
import { AuroraBackground } from "@lobehub/ui/awesome";
import { GitHubStarsButton } from "@/components/ui/shadcn-io/github-stars-button";

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
            <div className='glass-header relative flex min-h-11 items-center justify-between border-b px-2 py-1 text-nowrap'>
                {/* logo区域 */}
                <div className='logo flex flex-row items-center gap-1'>
                    <p>默言心绪</p>
                </div>

                {/* 导航区域 */}
                <div className='nav-links flex items-center gap-8'>
                    {navLinks.map((item) => (
                        <Link key={item.name} href={item.href}>
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* 导航按钮区域 */}

                <div className='header-actions flex items-center gap-2'>
                    <GitHubStarsButton
                        username='xerrors'
                        repo='Yuxi-Know'
                        formatted={true}
                    />
                </div>
            </div>

            {/* hero部分 */}
            <div className='hero-content relative flex h-full w-full flex-col items-center justify-center gap-8'>
                <AuroraBackground className='inset-0 -z-10' />

                <h1 className='title justify-between text-2xl'>与SQL对话</h1>
                <Link
                    className='start-chat inline items-center rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800'
                    href='/chat/'>
                    进入应用
                </Link>
            </div>
        </div>
    );
}
