import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
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

  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
      <button onClick={handleLogout}>Logout</button>
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
    props: {},
  };
};
