import { AgentsCard } from "@/components/nav/AgentsCard";
import { Bot, ChevronsUpDown, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/shadcn-io/icon-button";
import { ModeToggle } from "@/components/theme/ThemeSwitcher";

const AgentSelectButton = () => {
    const handleClickRefresh = () => {};
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline'>
                    <Bot />
                    <span>选择智能体</span>
                    <ChevronsUpDown />
                </Button>
            </DialogTrigger>

            <DialogContent showCloseButton={true}>
                <DialogHeader>
                    <DialogTitle>
                        <div className='flex flex-row items-center gap-2'>
                            <h1>选择智能体</h1>
                            <IconButton
                                icon={RefreshCcwIcon}
                                active={false}
                                color={[239, 68, 68]} // red-500
                                onClick={() => handleClickRefresh()}
                                size='sm'
                            />
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        从下方卡片中选择一个智能体开始对话！
                    </DialogDescription>
                </DialogHeader>
                {/* 传入一个AgentsTable */}
                <AgentsCard />
            </DialogContent>
        </Dialog>
    );
};

const TopNav = () => {
    return (
        <div className='top-nav flex w-full flex-row items-center justify-between border-b px-2 py-1'>
            <div className='agent-select'>
                <AgentSelectButton />
            </div>
            <div className=''>
                <ModeToggle />
            </div>
        </div>
    );
};

export { TopNav };
