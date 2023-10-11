// /api/create-chat
//special file name within app-router,so on seeing(/api/create-chat),it would map rest endpoint for this endpoint
// this file will map to /api/create-chat,then in the frontend we can hit this endpoint

import { db } from "@/lib/db";
import { loadS3IntoPinecone } from "@/lib/db/pinecone";
import { getS3Url } from "@/lib/db/s3";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log(file_key, file_name);
    await loadS3IntoPinecone(file_key);
    const databaseValues = {
      pdfName: file_name, 
      pdfUrl: getS3Url(file_key), 
      userID: userId,
      fileKey: file_key, 
    };

    const chat_id = await db.insert(chats).values(databaseValues).returning({
      insertedId: chats.id,
    });

    return NextResponse.json(
      {
        chat_id: chat_id[0].insertedId,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
