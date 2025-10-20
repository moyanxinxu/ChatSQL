import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";

const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

const truncateTitle = (title: string, maxLength: number) => {
    if (title.length <= maxLength) return title;
    return title.slice(0, maxLength) + "...";
};

export { cn, truncateTitle };
