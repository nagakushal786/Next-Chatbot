"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleRedirect = () => {
    if (!url) return;

    const formattedUrl = url.replace(/(^\w+:|^)\/\//, ""); 
    router.push(`/${encodeURIComponent(formattedUrl)}`); // Redirect to the dynamically generated page
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center">
      <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mb-11">
        Welcome to NextBot
      </h1>

      <h2 className="text-4xl font-bold text-white mb-6">Enter a URL</h2>
      
      <div className="flex gap-4 items-center">
        <Input
          type="url"
          placeholder="Enter a URL (e.g., https://www.wikipedia.org)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-96 text-white placeholder-gray-400 bg-zinc-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <Button
          onClick={handleRedirect}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-md shadow-md transition-all"
        >
          Go
        </Button>
      </div>
    </div>
  );
}