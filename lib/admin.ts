import { auth } from "@clerk/nextjs"

const adminIds = ["user_2dtkPXZVjh3ceHY9jxryfMLtWeE"];

export const isAdmin = () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  return adminIds.indexOf(userId) !== -1;
};
