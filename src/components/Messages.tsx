import {type Message as TMessage} from "ai/react";
import Message from "./Message";
import { MessageSquare } from "lucide-react";

interface MessageProps{
    messages: TMessage[]
}

const Messages = ({messages}: MessageProps) => {
  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col overflow-y-auto">
        {messages.length ? (
            messages.map((message, idx)=> (
                <Message key={idx} content={message.content} isUserMessage={message.role==="user"}/>
            ))
        ) : (<div className="flex flex-1 flex-col justify-center items-center gap-3 p-6">
            <MessageSquare className="size-20 text-blue-500"/>
            <h3 className="font-semibold text-2xl text-white">We&apos;re all set</h3>
            <p className="text-zinc-500 text-md">Ask your first question to get started!</p>
        </div>)}
    </div>
  )
}

export default Messages;