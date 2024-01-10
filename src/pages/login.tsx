import { useState } from 'react';
import { useRouter } from 'next/router';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    if (response.ok) {
      router.push('/');
    } else {
      console.error('Failed to log in');
    }
  };

  return (
    <div className='fixed left-0 top-0 w-full h-full flex flex-col justify-center items-center'>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <input
          className='border shadow-lg rounded-lg mr-4 p-2 outline-none w-full mb-4'
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="随便输入用户名登录"
          required
        />
        <button className='shadow-lg p-2 border rounded-lg w-full bg-blue-400 text-white' type="submit">登录</button>
      </form>
    </div>
  );
};

export default LoginPage;
