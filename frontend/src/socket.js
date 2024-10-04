"use client";
import dotenv from "dotenv";
import { io } from "socket.io-client";

const env = dotenv.config({ path: "../.env" });

export const socket = io(env.parsed.SOCKET_BASE_URL);
