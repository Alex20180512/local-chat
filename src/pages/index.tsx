import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function HomePage({ username }: { username: string }) {
  const router = useRouter();
  const [users, setUsers] = useState<string[]>([]);
  const [to, setTo] = useState('');
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<{ from: string; to: string; content: string; createTime: number }[]>([]);

  const handleLogout = async () => {
    const response = await fetch('/api/logout', {
      method: 'POST',
    });

    if (response.ok) {
      // 登出成功后重定向到登录页面
      router.push('/login');
    } else {
      // 处理错误情况
      console.error('Failed to log out');
    }
  };

  const handleSend = async () => {
    if (to.trim() === '') {
      alert('不知道发给谁');
      return;
    }

    if (content.trim() === '') {
      return;
    }

    const response = await fetch('/api/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, to }),
    });
    if (response.ok) {
      setContent('');
    }
  }

  useEffect(() => {
    const action = async () => {
      const res = await fetch('/api/loop');
      const data = await res.json();
      setUsers(data.userList);
      setMessages(data.message);
      if (to.trim() && data.userList.includes(to) === false) {
        setTo('');
      }
    }

    const interval = setInterval(action, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Welcome {username}</h1>
      <button onClick={handleLogout}>Logout</button>
      <br />
      <label>
        send message to: <select value={to} onChange={e => {
          setTo(e.target.value);
        }}>
          <option value=''> --请选择-- </option>
          {users.map((user, index) => (
            <option key={index} value={user}>{user}</option>
          ))}
        </select>
      </label>
      <br />
      <label>内容：
        <textarea className='border' value={content} onChange={e => setContent(e.target.value)}></textarea>
      </label>
      <br />
      <button onClick={handleSend}>发送</button>
      <ul>
        {
          messages.map(item => {
            return <li>
              <div>From: {item.from}</div>
              <div>To: {item.to}</div>
              <div>{item.content}</div>
            </li>
          })
        }
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx);
  const username = cookies.username;

  if (!username) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      username
    },
  };
};
