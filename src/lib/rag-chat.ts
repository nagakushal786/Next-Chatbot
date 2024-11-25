import { RAGChat, upstash } from "@upstash/rag-chat";
import { redis } from "./redis";

export const RagChat = new RAGChat({
    model: upstash("meta-llama/Meta-Llama-3-8B-Instruct", {
        maxTokens: 1000,
    }),
    redis: redis,
});
