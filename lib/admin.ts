import { auth } from "@clerk/nextjs"

const adminIds = [
  "user_2dtkPXZVjh3ceHY9jxryfMLtWeE",
  "user_2duBAkgLLQqm9W1W11NehfleniA",
  "user_2duB8TfaRlkeAWWEwaR9jsROtqL",
];

export const isAdmin = () => {
  const { userId } = auth();

  if (!userId) {
    return false;
  }

  return adminIds.indexOf(userId) !== -1;
};
