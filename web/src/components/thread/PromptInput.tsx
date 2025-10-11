import {
    PromptInput as Input,
    PromptInputSubmit,
    PromptInputTextarea,
    PromptInputToolbar,
} from "@/components/ui/shadcn-io/ai/prompt-input";

interface PromptInputProps {
    input: string;
    setInput: (input: string) => void;
    clickOnSubmit?: () => void;
}

const PromptInput = ({ input, setInput, clickOnSubmit }: PromptInputProps) => {
    return (
        <div className='px-[10%] pb-2'>
            <Input onSubmit={clickOnSubmit}>
                <PromptInputTextarea
                    value={input}
                    onChange={(e) => setInput(e.currentTarget.value)}
                    placeholder='在此输入你的提示...'
                />
                <PromptInputToolbar>
                    <div></div>
                    <PromptInputSubmit disabled={!input.trim()} />
                </PromptInputToolbar>
            </Input>
        </div>
    );
};

export { PromptInput };
