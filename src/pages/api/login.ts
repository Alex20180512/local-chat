// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 这里是一个简化的示例，你应该在生产应用中实现真正的身份验证逻辑
  if (req.method === 'POST') {
    const { username } = req.body;

    // 检查用户名不为空
    if (username) {
      // 设置 Cookie 表示用户已登录
      res.setHeader('Set-Cookie', cookie.serialize('username', username, { path: '/', httpOnly: true }));
      res.status(200).json({ message: 'Logged in successfully' });
      return;
    }
  }

  // 如果不是 POST 请求或用户名不存在，则返回错误
  res.status(400).json({ message: 'Invalid request' });
}
