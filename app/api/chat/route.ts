import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await replicate.run(
    "meta/llama-2-70b-chat:02e509c789964a7ea8736978a43525956ef40397be9033abf9fd2badfe68c9e3",
    {
      input: {
        prompt: message,
        temperature: 0.7,
        max_length: 500,
        top_p: 0.9,
      },
    }
  );

  return Response.json({ response });
}
