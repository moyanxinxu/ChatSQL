import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

const themeModes = [
    { value: "light", label: "亮色模式", icon: Sun },
    { value: "dark", label: "深色模式", icon: Moon },
    { value: "system", label: "跟随系统", icon: SunMoon },
];

const ModeToggle = () => {
    const { setTheme } = useTheme();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' size='icon'>
                    <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 text-yellow-500 transition-all dark:scale-0 dark:-rotate-90' />
                    <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 text-gray-500 transition-all dark:scale-100 dark:rotate-0 dark:opacity-90' />
                    <span className='sr-only'>Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                {themeModes.map((mode) => (
                    <DropdownMenuItem
                        key={mode.value}
                        onClick={() => setTheme(mode.value)}>
                        <div className='flex flex-row items-center gap-2'>
                            <mode.icon />
                            {mode.label}
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { ModeToggle };
