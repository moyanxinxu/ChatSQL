import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    Bot,
    GitCompareArrows,
    LibraryBig,
    Settings,
    UserRoundCog,
    Waypoints,
} from "lucide-react";

const sideTopNavList = [
    {
        name: "智能体",
        path: "/chat",
        icon: Bot,
    },
    {
        name: "图谱",
        path: "/graph",
        icon: Waypoints,
    },
    {
        name: "知识库",
        path: "/database",
        icon: LibraryBig,
    },
];

const sideButtomNavList = [
    {
        name: "Github",
        path: "https://github.com/moyanxinxu",
        icon: GitCompareArrows,
    },
    {
        name: "个人",
        path: "",
        icon: UserRoundCog,
    },
    {
        name: "设置",
        path: "",
        icon: Settings,
    },
];

const SideNav = () => {
    return (
        <div className='side-nav flex flex-col justify-between border-r px-1'>
            <div>
                {/* 头像区域 */}
                <div className='avatar flex items-center justify-center p-2'>
                    <Link href='/'>
                        <Avatar>
                            <AvatarImage src='/avatar.png' alt='avatar' />
                        </Avatar>
                    </Link>
                </div>
                {/* 主导航区域 */}
                <div className='flex flex-col gap-2 pt-2'>
                    {sideTopNavList.map((item) => (
                        <div key={item.name}>
                            <Link
                                href={item.path}
                                className='flex flex-col items-center'>
                                <item.icon />
                                <span className='text-nowrap'>{item.name}</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* 副导航 */}
            <div className='flex flex-col gap-2 pb-2'>
                {sideButtomNavList.map((item) => (
                    <div key={item.name}>
                        <Link
                            href={item.path}
                            className='flex flex-col items-center'>
                            <item.icon />
                            <span>{item.name}</span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { SideNav };
