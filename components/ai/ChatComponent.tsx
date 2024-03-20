"use client";

import React, { use, useEffect, useRef, useState } from "react";

import { Message, useChat } from "ai/react";
import axios from "axios";
import { ClipLoader } from "react-spinners";


import { useMessageStore } from "@/store/useMessageStore";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { BotAvatar } from "./BotAvatar";
import Report from "./Report";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User } from "@clerk/nextjs/server";

const ChatComponent = ({ language, user }: { language: string,user:User }) => {
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const {
    setInput,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    messages,
  } = useChat();
  const [languageMessages, setLanguageMessages] = useState<Message[]>([]);
  //const [messages,setMessages]=useState([])

  const [showReport, setShowReport] = useState(false);
  const [display, setDisplay] = useState("block");
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);
  const [option_view, setoption_view] = useState("hidden");
  const yogi =
    "https://i.ibb.co/S3ch3bG/d95f6514-ebc3-4e4e-be97-b1f4ca80c957-removebg-preview.png";

  const Profile = "";

  useEffect(() => {
    if (languageMessages.length > 0) setDisplay("hidden");
    if (chatContainerRef.current)
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
  }, [languageMessages]);

  const addMessages = useMessageStore((state) => state.addMessages);
  const router = useRouter();
  const genReport = () => {
    addMessages(languageMessages);
    router.push("/report");
  };

  const sendPostRequest = async (event: React.FormEvent) => {
    setLoading(true);
    event.preventDefault();
    try {
      const tmp_new: Message = {
        id: String(Math.random() * 10),
        content: input,
        role: "user",
      };
      const tmp_new_message: Message[] = [...languageMessages, tmp_new];

      // Use a functional update to ensure the most recent state is used
      setLanguageMessages((prevLanguageMessages) => [
        ...prevLanguageMessages,
        tmp_new,
      ]);

      setInput("");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: tmp_new_message, // Sending the most recent messages
          lang: language,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const stream = await response.arrayBuffer();
      const data = JSON.parse(new TextDecoder().decode(stream));

      // Create a new message object with id, role, and content

      if (language !== "english") {
        const res = await axios.post("/api/bing_translate", {
          body: data.choices[0].message.content,
          lang: language,
        });
        console.log(res);
        const newMessage: Message = {
          id: String(Math.random() * 10),
          //@ts-ignore
          content: res.data.translatedText,
          role: "assistant",
        };

        // Update languageMessages using functional update
        setLanguageMessages((prevLanguageMessages) => [
          ...prevLanguageMessages,
          newMessage,
        ]);
        setLoading(false);
      } else {
        setLoading(true);

        const newMessage: Message = {
          id: String(Math.random() * 10),
          content: data.choices[0].message.content,
          role: "assistant",
        };

        // Update languageMessages using functional update
        setLanguageMessages((prevLanguageMessages) => [
          ...prevLanguageMessages,
          newMessage,
        ]);
        let timeoutId: NodeJS.Timeout;
        if (loading) {
          timeoutId = setTimeout(() => {}, 1000);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const submit = () => {
    setLoading(true);
    let timeoutId: NodeJS.Timeout;
    handleSubmit;
    if (loading) {
      timeoutId = setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
    setLoading(true);
  };

  return (
    <div
      className="chat-container scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100   overflow-auto"
      ref={chatContainerRef}
      style={{
        maxHeight: "500px",
      }}
    >
      {language === "enish" ? (
        messages.map((message: Message) => (
          <div key={message.id}>
            <h3 className="text-lg font-semibold mt-2">
              <div className="flex flex-row py-2">
                {message.role === "assistant" ? (
                  <BotAvatar props={yogi} />
                ) : (
                  <BotAvatar props={user.imageUrl} />
                )}
                <h2 className="px-2">
                  {message.role === "assistant" ? "Dobby" : "You"}
                </h2>
              </div>
            </h3>

            {message.content
              .split("\n")
              .map((currentTextBlock: string, index: number) => {
                if (currentTextBlock === "") {
                  return <p key={message.id + index}>&nbsp;</p>;
                } else {
                  if (currentTextBlock.includes("Vata") && flag === false) {
                    setFlag(true);
                  } else if (
                    currentTextBlock.includes("Pitta") &&
                    flag === false
                  ) {
                    setFlag(true);
                  } else if (
                    currentTextBlock.includes("Kapha") &&
                    flag === false
                  ) {
                    setFlag(true);
                  }
                  return <p key={message.id + index}>{currentTextBlock}</p>;
                }
              })}
          </div>
        ))
      ) : (
        <>
          {languageMessages.map((message: Message) => (
            <div key={message.id}>
              <h3 className="text-lg font-semibold mt-2">
                <div className="flex flex-row py-2">
                  {message.role === "assistant" ? (
                    <BotAvatar props={yogi} />
                  ) : (
                    <BotAvatar props={Profile} />
                  )}
                  <h2 className="px-2">
                    {message.role === "assistant" ? "Dobby" : "You"}
                  </h2>
                </div>
              </h3>

              {message.role === "assistant" ? (
                // @ts-ignore
                <p>{message.content}</p>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          ))}
        </>
      )}
      {loading && (
        <div className="flex justify-center items-center h-full">
          <ClipLoader color="lightblue" size={80} />
        </div>
      )}

      <form className="mt-12" onSubmit={sendPostRequest}>
        <div className={"flex flex-row p-2 " + display}>
          {languageMessages.length === 0 && messages.length === 0 && (
            <>
              <Image src={yogi} alt="" height={52} width={52} />
              <p className="px-2">
                Hey there! I am Dobby,Your Personalized AI for Groot{" "}
              </p>
            </>
          )}
        </div>
        {/* <div
          className={
            "w-full justify-between flex flex-row gap-4 px-5 py-5 items-stretch  hidden"
          }
        >
          <Button
            className="w-full "
            type="submit"
            disabled={loading}
            onClick={(e) => {
              setInput("A")
            }}
          >
            A
          </Button>
          <Button
            className="w-full "
            type="submit"
            disabled={loading}
            onClick={() => {
              setInput("B")
            }}
          >
            B
          </Button>
          <Button
            disabled={loading}
            className="w-full "
            type="submit"
            onClick={() => {
              setInput("C")
            }}
          >
            C
          </Button>
        </div> */}
        <div className="flex flex-row py-2">
          <Input
            className="text-black"
            value={input}
            placeholder="Ask to Dobby"
            onChange={handleInputChange}
          />
          <Button
            disabled={loading}
            className="font-bold text-lg mx-2 bg-sky-500 hover:bg-sky-400"
            type="submit"
          >
            {" "}
            →
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatComponent;
