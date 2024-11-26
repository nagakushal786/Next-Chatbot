import ChatWrapper from "@/components/ChatWrapper";
import { RagChat } from "@/lib/rag-chat";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import React from "react";

interface PageProps {
    params: Promise<{
        url: string[];
    }>;
}

function reconstructUrl({ url }: { url: string[] }) {
    const decodedComponents = url.map((comp) => decodeURIComponent(comp));
    const joinedUrl = decodedComponents.join("/");
  
    // Add protocol if missing (assumes https by default)
    if (!/^https?:\/\//.test(joinedUrl)) {
      return `https://${joinedUrl}`;
    }
  
    return joinedUrl;
}

const Page = async ({ params }: PageProps) => {
    const resolvedParams = await params; // Resolve the params promise
    const { url } = resolvedParams;

    const sessionCookie = (await cookies()).get("sessionId")?.value;
    const reconstructedUrl = reconstructUrl({ url });

    const isAlreadyIndexed = await redis.sismember("indexed-urls", reconstructedUrl);

    const sessionId = (reconstructedUrl + "--" + sessionCookie).replace(/\//g, "");

    const initialMessages = await RagChat.history.getMessages({ amount: 10, sessionId });

    if (!isAlreadyIndexed) {
        await RagChat.context.add({
            type: "html",
            source: reconstructedUrl,
            config: {
                chunkOverlap: 20,
                chunkSize: 100,
            },
        });

        await redis.sadd("indexed-urls", reconstructedUrl);
    }

    return <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />;
};

export default Page;