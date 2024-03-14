import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";
import { users } from "./state";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { username } = req.body;
    if (username) {
      if (users.has(username) === false) {
        users.add(username);
      } else {
        res.status(400).json({ message: "用户已存在" });
        return;
      }
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("username", username, { path: "/", httpOnly: true })
      );
      res.status(200).json({ message: "Logged in successfully" });
      return;
    }
  }
  res.status(400).json({ message: "Invalid request" });
}
