import { NextApiRequest, NextApiResponse } from "next";
import { initSocket, NextApiResponseWithSocket } from "@/lib/socket";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (req.method === "GET") {
    initSocket(res);
    res.end();
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
