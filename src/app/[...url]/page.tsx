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

// Function to reconstruct and sanitize the URL
function reconstructUrl({ url }: { url: string[] }) {
  const decodedComponents = url.map((comp) => decodeURIComponent(comp));
  const joinedUrl = decodedComponents.join("/");

  // Add protocol if missing (assumes https:// by default)
  if (!/^https?:\/\//.test(joinedUrl)) {
    return `https://${joinedUrl}`;
  }

  return joinedUrl;
}

// Main Page component
const Page = async ({ params }: PageProps) => {
  try {
    const resolvedParams = await params; // Resolve the params promise
    const { url } = resolvedParams;

    console.log("Resolved URL:", url); // Add logging to debug

    if (!url || url.length === 0) {
      throw new Error("Invalid URL parameter.");
    }

    const sessionCookie = (await cookies()).get("sessionId")?.value || "guest";
    const reconstructedUrl = reconstructUrl({ url });

    console.log("Reconstructed URL:", reconstructedUrl); // Add logging to debug

    // Check if URL has already been indexed
    const isAlreadyIndexed = await redis.sismember("indexed-urls", reconstructedUrl);

    // Create a unique session ID
    const sessionId = (reconstructedUrl + "--" + sessionCookie).replace(/\//g, "");

    // Fetch chat history
    const initialMessages = await RagChat.history.getMessages({
      amount: 10,
      sessionId,
    });

    // Index the URL if not already done
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

    // Render the ChatWrapper component
    return <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />;
  } catch (error) {
    console.error("Error occurred on the server:", error);

    return (
      <div className="min-h-screen bg-black flex justify-center items-center flex-col">
        <h1 className="text-3xl text-white">An error occurred while processing your request.</h1>
        <p className="text-gray-400 mt-2">Please check the URL and try again.</p>
      </div>
    );
  }
};

export default Page;