import { GetServerSideProps } from "next";
import { parseCookies } from "nookies";
import { MouseEventHandler, useEffect, useMemo, useState } from "react";
import ClipboardJS from "clipboard";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import dayjs from "dayjs";

const withUser = atomWithStorage("chat-user", "");
let timer: NodeJS.Timeout | undefined;
export default function HomePage({ username }: { username: string }) {
  const [users, setUsers] = useState<string[]>([]);
  const [to, setTo] = useAtom(withUser);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<
    { from: string; to: string; content: string; createTime: number }[]
  >([]);

  const handleSend = async () => {
    if (to.trim() === "") {
      alert("不知道发给谁");
      return;
    }

    if (content.trim() === "") {
      return;
    }

    const response = await fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, to }),
    });
    if (response.ok) {
      setContent("");
    }
  };

  useEffect(() => {
    const action = async () => {
      const res = await fetch("/api/loop");
      const data = await res.json();
      setUsers(data.userList);
      setMessages(data.message);
      if (to.trim() && data.userList.includes(to) === false) {
        setTo("");
      }
    };

    const interval = setInterval(action, 500);

    new ClipboardJS(".btn");

    return () => clearInterval(interval);
  }, []);

  const filteredMessages = useMemo(() => {
    if (to.trim() === "") {
      return [];
    } else {
      return messages.filter((message) => {
        return (
          (message.from === username && message.to === to) ||
          (message.from === to && message.to === username)
        );
      });
    }
  }, [to, messages, username]);

  const onClick: MouseEventHandler = (e) => {
    if (timer) return;
    const button = e.target as HTMLButtonElement;
    const old = button.textContent;
    button.textContent = "复制成功";
    timer = setTimeout(() => {
      button.textContent = old;
      timer = undefined;
    }, 1500);
  };

  return (
    <div className="fixed max-w-[500px] md:max-w-[375px] max-h-[1000px] md:max-h-[800px] overflow-hidden w-full h-full shadow-2xl rounded-none md:rounded-2xl left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="h-[56px] flex items-center justify-between p-4 border-[#ddd] border-b-[1px]">
        <label>
          <select
            className="outline-none"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
            }}
          >
            <option value="">选择聊天用户</option>
            {users.map((user, index) => (
              <option key={index} value={user}>
                {user}
              </option>
            ))}
          </select>
        </label>
        <span className="text-[12px]">{users.length} 人在线</span>
      </div>
      <div
        className="flex flex-col justify-between "
        style={{ height: "calc(100% - 56px)" }}
      >
        <div className="flex-1 h-full  overflow-auto">
          <ul>
            {filteredMessages.map((item, index) => {
              return (
                <li key={index} className="w-full">
                  <div className="max-w-[400px] p-4 m-4 border shadow-md rounded-lg flex flex-col">
                    <span className="text-[12px]">
                      {item.from === username && (
                        <span className="inline-block bg-slate-400 w-[30px] h-[30px] text-white text-center rounded-full leading-[30px] mr-2">
                          You{" "}
                        </span>
                      )}
                      {dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")}
                    </span>
                    <p className="text-gray-900 my-2 max-h-[100px] overflow-auto">
                      {item.content}
                    </p>
                    <button
                      className="btn bg-blue-500 text-white rounded px-2 py-1 text-sm"
                      data-clipboard-text={item.content}
                      onClick={onClick}
                    >
                      复制
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex flex-col w-full h-[100px] box-border p-4 mb-4 border-t-[1px]">
          <div className="text-[10px] inline-block">
            <span className="bg-slate-200 px-2 rounded-md inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="w-3 h-3 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
              {username}
            </span>
          </div>
          <div className="flex border-[#ddd]">
            <textarea
              className="flex-1 border mr-4 resize-none shadow-lg rounded-md outline-none p-2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
            ></textarea>
            <button
              className="shadow-lg p-2 border rounded-lg w-[100px] bg-blue-400 text-white"
              onClick={handleSend}
            >
              发送
            </button>
          </div>
        </div>
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
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      username,
    },
  };
};
