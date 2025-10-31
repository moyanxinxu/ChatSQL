"use client";
import { Agent, Thread } from "@/types/chat.types";
import { Bot, ChevronsUpDown, DatabaseBackup, RefreshCcw, TerminalSquare, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItem, ComboboxTrigger } from "@/components/ui/shadcn-io/combobox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getAgents, getLatestThread } from "@/app/api/chat";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ModeToggle } from "@/components/theme/ThemeSwitcher";
import { useEffect, useState } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import { NewUserForm } from "@/components/user/NewUserForm";

const AgentCombox = () => {
    const router = useRouter();
    const pathname = usePathname();

    const { agentId, threadId } = useParams();

    const [agents, setAgents] = useState<Agent[]>([]);
    const [curAgentId, setCurAgentId] = useState(agentId);

    const handleChangeSelectedAgent = async (nextAgentId: string) => {
        // 首先获取该智能体的最新线程ID，然后跳转页面。
        if (nextAgentId !== curAgentId && !threadId) {
            setCurAgentId(nextAgentId);
            router.replace(`/chat/${nextAgentId}`);
        } else {
            if (threadId) {
                setCurAgentId(nextAgentId);

                const latestThreadId: Thread =
                    await getLatestThread(nextAgentId);
                router.replace(`/chat/${nextAgentId}/${latestThreadId}`);
            }
        }
    };

    useEffect(() => {
        // 初始获取智能体列表
        const initAgents = async () => {
            const agents: Agent[] = await getAgents();
            setAgents(agents);
        };
        initAgents();
    }, []);

    useEffect(() => {
        if (pathname === "/chat") {
            const redirect_agent_id = agents[0]?.id;

            setCurAgentId(redirect_agent_id);
            router.replace(`/chat/${redirect_agent_id}`);
        }
    }, [pathname, agents, router]);

    return (
        <div className='agents-combox'>
            <Combobox
                data={agents.map((agent) => ({
                    value: agent.id,
                    label: agent.name,
                }))}
                type='智能体'
                onValueChange={handleChangeSelectedAgent}>
                {/* > */}
                <ComboboxTrigger>
                    <Bot />
                    <span>{curAgentId}</span>
                    <ChevronsUpDown />
                </ComboboxTrigger>

                <ComboboxContent>
                    <ComboboxInput />
                    <ComboboxEmpty />
                    <ComboboxGroup>
                        {agents.map((item: Agent) => (
                            <ComboboxItem
                                key={item.id}
                                value={item.id}
                                className={cn(
                                    item.id === curAgentId ? "border-2" : "",
                                )}>
                                <HoverCard openDelay={50} closeDelay={100}>
                                    <HoverCardTrigger>
                                        <div>{item.id}</div>
                                    </HoverCardTrigger>
                                    <HoverCardContent side='left'>
                                        <div className='graph-info flex flex-col gap-1'>
                                            <div>{item.name}</div>
                                            <div>{`${item.config_schema.provider}(${item.config_schema.model})`}</div>
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </ComboboxItem>
                        ))}
                    </ComboboxGroup>
                </ComboboxContent>
            </Combobox>
        </div>
    );
};

const TopNav = () => {
    return (
        <div className='top-nav flex w-full flex-row items-center justify-end gap-1 border-b px-2 py-1'>
            <AgentCombox />
            <ModeToggle />
        </div>
    );
};

const dashBoardPages = [
    {
        name: "会话管理",
        path: "/admin/threads",
        icon: DatabaseBackup,
    },
    {
        name: "智能体管理",
        path: "/admin/agents",
        icon: Bot,
    },
    {
        name: "模型配置",
        path: "/admin/providers",
        icon: TerminalSquare,
    },
    {
        name: "用户管理",
        path: "/admin/users",
        icon: User2,
    },
];

const DashTopNav = () => {
    const [currentPage, setCurrentPage] = useState(dashBoardPages[0]);
    const router = useRouter();
    const pathname = usePathname();

    // 根据当前路径动态设置 currentPage
    useEffect(() => {
        const currentPage = dashBoardPages.find(
            (page) => page.path === pathname,
        );
        if (currentPage) {
            setCurrentPage(currentPage);
        }
    }, [pathname]);

    const handleClickMenuItem = (dashBoardPagesItem: {
        name: string;
        path: string;
        icon: any;
    }) => {
        if (dashBoardPagesItem.path !== currentPage.path) {
            router.replace(dashBoardPagesItem.path);
        }
    };
    return (
        <div className='top-nav flex w-full flex-row items-center justify-between border-b px-2 py-2'>
            <div className='top-nav-left flex flex-row items-center gap-1'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>
                            <currentPage.icon />
                            {currentPage.name}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {dashBoardPages.map(
                            (item) =>
                                item.name != currentPage.name && (
                                    <DropdownMenuItem
                                        key={item.name}
                                        onClick={() =>
                                            handleClickMenuItem(item)
                                        }
                                        className='items-center'>
                                        <item.icon />
                                        {item.name}
                                    </DropdownMenuItem>
                                ),
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className='top-nav-button flex flex-row items-center gap-1'>
                {pathname === "/admin/users" && <NewUserForm />}
                <Button variant='outline' size='icon'>
                    <RefreshCcw />
                </Button>

                <ModeToggle />
            </div>
        </div>
    );
};

export { TopNav, DashTopNav };
