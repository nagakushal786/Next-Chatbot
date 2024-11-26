import ChatWrapper from "@/components/ChatWrapper";
import { RagChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import React from "react";

interface PageProps{
    params: {
        url: string[]
    }
}

function reconstructUrl({url}: {url: string[]}){
    const decodedComponents=url.map((comp)=> decodeURIComponent(comp));

    return decodedComponents.join("/");
}

const Page=async ({params}: PageProps)=> {
    const sessionCookie=(await cookies()).get("sessionId")?.value;
    const reconstructedUrl=reconstructUrl({url: params.url});

    const isAlreadyIndexed=await redis.sismember("indexed-urls", reconstructedUrl);

    const sessionId=(reconstructedUrl+"--"+sessionCookie).replace(/\//g, "");

    const initialMessages=await RagChat.history.getMessages({amount: 10, sessionId});
    
    if(!isAlreadyIndexed){
        await RagChat.context.add({
            type: "html",
            source: reconstructedUrl,
            config: {
                chunkOverlap: 20,
                chunkSize: 100
            }
        });

        await redis.sadd("indexed-urls", reconstructedUrl);
    }

    return <ChatWrapper sessionId={sessionId} initialMessages={initialMessages}/>
}

export default Page;