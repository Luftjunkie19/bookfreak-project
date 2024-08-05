import { useAssistant } from 'ai/react';

export default function Page() {

    const { setInput, setMessages, submitMessage, messages} = useAssistant({
        api: '/api/aissistant',
        threadId:''
    });

    return (
        <div>




        </div>
    );
}