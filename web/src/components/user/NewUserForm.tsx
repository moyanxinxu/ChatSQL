'use client'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { UserPlus, User, UserCog, Crown, Forward, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { FormEvent } from "react";

import { toast } from "sonner";

const userRoleList = [
    { value: 'user', label: '普通用户', icon: User, color: '#3a88fe' },
    { value: 'admin', label: '管理员', icon: UserCog, color: '#147655' },
    { value: 'superadmin', label: '超级管理员', icon: Crown, color: '#f56565' },
]



const NewUserForm = () => {
    const handleUserCreate = async (event: FormEvent<HTMLFormElement>) => {
        //显示用户名和密码
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username');
        const password = formData.get('password');
        const role = formData.get('role');

        const resp = await createUser(username as string, password as string, role as string);
        if (resp.ok) {
            toast.success(`用户 ${username} 创建成功，权限为 ${role}。`);
        } else {
            const data = await resp.json();
            toast.error(`用户创建失败：${data.detail || resp.statusText}`);
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="flex flex-row border rounded-sm py-1 px-2 hover:bg-secondary items-center gap-2 border-green-600 bg-green-100 dark:border-green-500 dark:bg-green-900"
                >
                    <UserPlus size={18} className="stroke-green-600 dark:stroke-green-500" />
                    新用户
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>新用户</DialogTitle>
                    <DialogDescription>
                        确保准确无误地输入用户信息，最后还要点击确认按钮。
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleUserCreate} className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="username">用户名</Label>
                        <Input id="username" name="username" defaultValue="admin" />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="password">密码</Label>
                        <Input id="password" type="password" name="password" defaultValue="******" />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="role">权限</Label>
                        <Select name="role" defaultValue="user">
                            <SelectTrigger>
                                <SelectValue placeholder="选择权限" />
                            </SelectTrigger>
                            <SelectContent>
                                {userRoleList.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                        <div className="flex items-center gap-2">
                                            <role.icon color={role.color} size={16} />
                                            {role.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="flex flex-row gap-1">
                                取消 <X size={16} />
                            </Button>
                        </DialogClose>

                        <Button type="submit" className="flex flex-row items-center gap-1">
                            添加 <Forward size={16} />
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export { NewUserForm };