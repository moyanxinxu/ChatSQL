import { ThreadList } from "@/components/admin/thread";

export default function Home() {
    return (
        <div className='dashboard flex flex-col'>
            <div className='db-body m-1 flex flex-col'>
                <ThreadList maxSize={1} />
            </div>
        </div>
    );
}
