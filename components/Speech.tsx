"use client";
import { useRouter } from "next/navigation";
import SpeechRecognition,{ useSpeechRecognition } from "react-speech-recognition";

const Speech = () => {
  const router = useRouter();

  const commands = [
    {
      command: ["Open *"],
      callback: (redirectPage: string) => redirectToPage(redirectPage),
    },
  ];

  const { transcript } = useSpeechRecognition({ commands });

  const redirectToPage = (page: string) => {
    switch (page.toLowerCase()) {
      case "home":
        router.push("/");
        break;
      case "blog":
        router.push("/blog");
        break;
      case "add blog post":
        router.push("/blog/new");
        break;
      case "contact":
        router.push("/contact");
        break;
      default:
        // Handle invalid command
        break;
    }
  };

  return (
    <>
      <p id="transcript">Transcript: {transcript}</p>
      <button onClick={()=>SpeechRecognition.startListening}>Start</button>
    </>
  );
};

export default Speech;
