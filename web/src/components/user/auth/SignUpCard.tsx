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
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";

export const title = "注册卡片";

const SignUpCard = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        await signUp.email({
            email,
            password,
            name: "",
            image: "",
            callbackURL: "/",
            fetchOptions: {
                onRequest: () => {
                    setLoading(true);
                },
                onResponse: () => {
                    setLoading(false);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    toast.success("注册成功!");
                    setTimeout(() => {
                        redirect("/");
                    }, 1000);
                },
            },
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>注册账号</CardTitle>
                <CardDescription>
                    输入注册邮箱与密码以创建新账号
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
                </div>
                <div className='space-y-2'>
                    <Label htmlFor='password'>再次确认密码</Label>
                    <Input
                        id='password_confirmation'
                        type='password'
                        value={passwordConfirmation}
                        onChange={(e) =>
                            setPasswordConfirmation(e.target.value)
                        }
                        autoComplete='new-password'
                    />
                    <a className='text-sm hover:underline' href='#'>
                        前后密码应保持完全一致
                    </a>
                </div>
                <Button
                    className='w-full'
                    onClick={handleSignUp}
                    disabled={loading}>
                    {loading ? (
                        <Loader2 size={16} className='animate-spin' />
                    ) : (
                        "注册"
                    )}
                </Button>
            </CardContent>
            <CardFooter className='flex justify-center'>
                <p className='text-muted-foreground text-sm'>
                    已经注册账号？
                    <a className='underline' href='/auth/login'>
                        立刻登录
                    </a>
                </p>
            </CardFooter>
        </Card>
    );
};

export { SignUpCard };
