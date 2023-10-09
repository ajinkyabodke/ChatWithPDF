// /api/create-chat
//special file name within app-router,so on seeing(/api/create-chat),it would map rest endpoint for this endpoint
// this file will map to /api/create-chat,then in the frontend we can hit this endpoint

import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    console.log(file_key, file_name);
    return NextResponse.json({ message: "Success " });
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
