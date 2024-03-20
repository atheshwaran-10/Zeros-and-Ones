import {
  getTopTenUsers,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

import { Dispatch, SetStateAction, useState } from "react";
import { BotAvatar } from "@/components/ai/BotAvatar";
import ChatComponent from "@/components/ai/ChatComponent";

export default  async function Home() {
  
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  const leaderboardData = getTopTenUsers();
  const source =
    "https://i.ibb.co/S3ch3bG/d95f6514-ebc3-4e4e-be97-b1f4ca80c957-removebg-preview.png";

  const [userProgress, userSubscription, leaderboard] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    leaderboardData,
  ]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className=" border  p-3 w-full xl:w-2/3 rounded-md">
        <div className="flex flex-row py-2 justify-center w-full border-b-2 border-white-500">
          <BotAvatar props={source} />
          <h2 className="text-2xl px-2">Dobby</h2>
        </div>
        {/* //@ts-ignore */}
        <ChatComponent language={"english"}
        //@ts-ignore
         user={userProgress} />
      </div>
    </main>
  );
}
