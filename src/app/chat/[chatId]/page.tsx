import ChatSideBar from "@/components/ChatSideBar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import { eq } from "drizzle-orm";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userID, userId));
  if (!_chats) {
    return redirect("/");
  }

  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-[1] max-w-xs">
        <ChatSideBar chats={_chats} chatId={parseInt(chatId)} />
      </div>
      <div className="max-h-screen p-4 oveflow-scroll flex-[5]">
        {/* Content of your chat viewer */}
      </div>
      <div className="flex-[3] border-l-4 border-l-slate-200">
        {/* Content of your chat component */}
      </div>
    </div>
  );
};

export default ChatPage;
