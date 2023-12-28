import type { NextApiRequest, NextApiResponse } from 'next';
import { message, users } from './state';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const username = cookies.username;

  if (users.has(username) === false) {
    users.add(username);
  }

  const userList = [...users].filter(item => item !== username);

  res.status(200).json({ userList, message });
}
