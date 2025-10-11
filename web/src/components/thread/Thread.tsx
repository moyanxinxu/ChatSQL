import { Message } from "@/types/chat.types";
import { Response } from "@/components/ui/shadcn-io/ai/response";
import {
    Message as MessageComponent,
    // MessageAvatar,
    MessageContent,
} from "@/components/ui/shadcn-io/ai/message";

const Thread = ({ messages }: { messages: Message[] }) => {
    return (
        <div className='mx-auto flex w-[80%] max-w-4xl flex-col p-3'>
            {messages.map((message) => (
                <MessageComponent
                    key={message.id}
                    from={message.type === "human" ? "user" : "assistant"}>
                    {/* {message.type === "human" ? (
                        <MessageAvatar
                            src='https://github.com/dovazencot.png'
                            name='User'
                        />
                    ) : (
                        <MessageAvatar
                            src='https://github.com/openai.png'
                            name='AI'
                        />
                    )} */}
                    <MessageContent>
                        <Response>{message.content}</Response>
                    </MessageContent>
                </MessageComponent>
            ))}
        </div>
    );
};
export { Thread };
