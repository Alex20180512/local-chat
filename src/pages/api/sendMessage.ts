import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import { message } from './state';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { content, to } = req.body;
    const cookies = cookie.parse(req.headers.cookie || '');
    const username = cookies.username;
    if (username) {
      const newMessage = {
        createTime: Date.now(),
        from: username,
        to,
        content,
      }
      message.push(newMessage);
      res.status(200).json({ message: 'ok' });
      return;
    }
  }
  res.status(400).json({ message: 'Invalid request' });
}
