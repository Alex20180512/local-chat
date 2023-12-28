import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import { users } from './state';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const cookies = cookie.parse(req.headers.cookie || '');
    const username = cookies.username;
    users.delete(username);
    res.setHeader('Set-Cookie', cookie.serialize('username', '', { maxAge: -1, path: '/' }));
    res.status(200).json({ message: 'Logged out successfully' });
    return;
  }
  res.status(405).json({ message: 'Method Not Allowed' });
}
