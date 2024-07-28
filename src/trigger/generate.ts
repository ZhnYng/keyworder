import { logger, task, wait } from "@trigger.dev/sdk/v3";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateMetadata = task({
  id: "generating-image-metadata",
  run: async (
    {
      imageUrl,
      fileName,
    }: {
      imageUrl: string;
      fileName: string;
    },
    { ctx }
  ) => {
    logger.info(`Starting metadata generation for: ${imageUrl}`);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { "type": "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Generate a JSON object with the following keys:
                    - "title": a string of 3 to 10 characters
                    - "description": a string of 20 to 60 characters
                    - "keywords": an array of 50 one-word key descriptions of the image.
                    The image URL is: ${imageUrl}`
            },
            {
              type: "image_url",
              image_url: {
                "url": imageUrl,
                "detail": "low"
              },
            },
          ],
        },
      ],
    });

    const metadata: {
      title: string
      description: string
      keywords: string[]
    } = JSON.parse(response.choices[0].message.content!);

    return {
      ...metadata,
      fileName,
    };
  },
});
