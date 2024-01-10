import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { MouseEventHandler, useEffect, useMemo, useState } from 'react';
import ClipboardJS from 'clipboard';

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
      router.push('/login');
    } else {
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

    const interval = setInterval(action, 500);

    new ClipboardJS('.btn');

    return () => clearInterval(interval);
  }, []);

  const filteredMessages = useMemo(() => {
    if (to.trim() === '') {
      return []
    } else {
      return messages.filter(item => item.to === username);
    }
  }, [to, messages]);

  const onClick: MouseEventHandler = (e) => {
    const button = e.target as HTMLButtonElement;
    const old = button.textContent;
    button.textContent = '复制成功';
    setTimeout(() => {
      button.textContent = old;
    }, 1500);
  }

  return (
    <div className='flex flex-col items-center pb-[200px]'>
      <h1 className='text-[30px] font-bold m-2'>Welcome {username}</h1>
      <button onClick={handleLogout} className='bg-red-500 text-white rounded-md px-2 py-1 text-[12px] self-end mr-4'>退出登录</button>
      <br />
      <label>
        选择聊天用户: <select value={to} onChange={e => {
          setTo(e.target.value);
        }}>
          <option value=''> --请选择-- </option>
          {users.map((user, index) => (
            <option key={index} value={user}>{user}</option>
          ))}
        </select>
      </label>
      <ul>
        {
          filteredMessages.map((item, index) => {
            return <li key={index} className='w-full mt-8'>
              <div className="max-w-[400px] p-4 border shadow-md rounded-lg flex flex-col">
                <h2 className="text-xl font-bold">来自: {item.from} 的消息</h2>
                <p className="text-gray-600 py-4 my-2 max-h-[100px] overflow-auto">{item.content}</p>
                <button className="btn bg-blue-500 text-white rounded px-2 py-1 text-sm" data-clipboard-text={item.content} onClick={onClick}>复制</button>
              </div>
            </li>
          })
        }
      </ul>
      <div className='fixed left-0 bottom-0 w-full h-[100px] box-border p-4 flex'>
        <textarea className='flex-1 border mr-2 resize-none shadow-lg rounded-md outline-none p-2' value={content} onChange={e => setContent(e.target.value)}></textarea>
        <button className='shadow-lg p-2 border rounded-lg w-[100px] bg-blue-400 text-white' onClick={handleSend}>发送</button>
      </div>
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
