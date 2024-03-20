import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(request: Request) {
  const { messages, lang } = await request.json();

  const openaiMessages = messages.map((content: any) => ({
    role: content.role,
    content: content.content,
  }));

  console.log(openaiMessages);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `Your alias is Dobby as people can refer you as Dobby,`,
      },
      ...openaiMessages,
    ],
  });

  const stream = await response.arrayBuffer();
  const data = JSON.parse(new TextDecoder().decode(stream));

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
