// pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 发送请求到登录 API
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      // 登录成功后重定向到首页
      router.push('/');
    } else {
      // 处理错误情况（例如显示错误消息）
      console.error('Failed to log in');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Username"
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
