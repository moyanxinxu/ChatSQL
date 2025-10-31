import { Toaster } from 'sonner'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (

        <div className='flex h-full w-full items-center justify-center'>
            {children}

            <Toaster />
        </div>


    );
}