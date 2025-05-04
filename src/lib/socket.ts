import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocket = (res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Client connected");

      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });
  }
  return res.socket.server.io;
};

export const emitStatsUpdate = async (io: SocketIOServer) => {
  try {
    // Get cocktail rankings
    const cocktailRankings = await prisma.$queryRaw`
      SELECT c.id, c.name, COALESCE(SUM(v.points), 0) as points
      FROM cocktails c
      LEFT JOIN votes v ON c.id = v.option_id AND v.vote_type = 'cocktail'
      GROUP BY c.id, c.name
      ORDER BY points DESC
    `;

    // Get dragon rankings
    const dragonRankings = await prisma.$queryRaw`
      SELECT d.id, d.name, COALESCE(SUM(v.points), 0) as points
      FROM dragons d
      LEFT JOIN votes v ON d.id = v.option_id AND v.vote_type = 'dragon'
      GROUP BY d.id, d.name
      ORDER BY points DESC
    `;

    io.emit("statsUpdate", {
      cocktails: cocktailRankings,
      dragons: dragonRankings,
    });
  } catch (error) {
    console.error("Error emitting stats update:", error);
  }
};
