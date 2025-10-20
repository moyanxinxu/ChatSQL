import { ThreadList } from "@/components/admin/thread";

export default function Home() {
    return (
        <div className='my-2 mr-3 ml-2 flex flex-col'>
            <ThreadList maxSize={2} />
        </div>
    );
}
