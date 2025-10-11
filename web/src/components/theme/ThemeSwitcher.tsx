"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

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
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    亮色模式
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    深色模式
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    跟随系统
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export { ModeToggle };