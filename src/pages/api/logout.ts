// pages/api/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // 删除 Cookie
    res.setHeader('Set-Cookie', cookie.serialize('username', '', { maxAge: -1, path: '/' }));
    res.status(200).json({ message: 'Logged out successfully' });
    return;
  }

  // 如果不是 POST 请求，则返回错误
  res.status(405).json({ message: 'Method Not Allowed' });
}
