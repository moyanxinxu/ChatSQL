"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

export const title = "登录卡片";

const LogInCard = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        await signIn.email(
            { email, password, callbackURL: "/" },
            {
                onRequest: () => {
                    setLoading(true);
                },
                onResponse: () => {
                    setLoading(false);
                },

                onSuccess: () => {
                    toast.success("登录成功!");
                    setTimeout(() => {
                        redirect("/");
                    }, 1000);
                },
            },
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>登录账号</CardTitle>
                <CardDescription>
                    输入用户邮箱与密码以登录到您的帐户
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='space-y-2'>
                    <Label htmlFor='email'>邮箱</Label>
                    <Input
                        id='email'
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='admin@admin.com'
                        type='text'
                        value={email}
                    />
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='password'>密码</Label>
                    <Input
                        id='password'
                        onChange={(e) => setPassword(e.target.value)}
                        type='password'
                        value={password}
                    />
                    <a className='text-sm hover:underline' href='#'>
                        忘记密码？
                    </a>
                </div>
                <Button
                    className='w-full'
                    onClick={handleLogin}
                    disabled={loading}>
                    {loading ? (
                        <Loader2 size={16} className='animate-spin' />
                    ) : (
                        "登录"
                    )}
                </Button>
            </CardContent>
            <CardFooter className='flex justify-center'>
                <p className='text-muted-foreground text-sm'>
                    尚未注册邮箱？
                    <a className='underline' href='/auth/signup'>
                        立刻注册
                    </a>
                </p>
            </CardFooter>
        </Card>
    );
};

export { LogInCard };
