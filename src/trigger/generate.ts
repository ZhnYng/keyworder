import { configure } from "@trigger.dev/sdk/v3";
import { logger, task, wait } from "@trigger.dev/sdk/v3";
import OpenAI from "openai";

if (process.env.NODE_ENV === "production") {
  configure({
    secretKey: process.env.TRIGGER_SECRET_KEY,
  });
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const generateMetadata = task({
  id: "generating-image-metadata",
  run: async (
    {
      imageUrl,
      fileName,
      stripe_customer_id
    }: {
      imageUrl: string;
      fileName: string;
      stripe_customer_id: string;
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
                    - "title": a string of at least 3 words
                    - "description": a string of 20 to 60 characters
                    - "keywords": an array of 50 one-word key descriptions of the image.
                    - "adobe_stock_category": pick a number from 1 to 21, which category most closely matches the image. Information of adobe stock categories can be found in the Appendix.

                    The image URL is: ${imageUrl}

                    Appendix:

                    Adobe stock categories:
                      Choose a category that describes your content as accurately as possible. Here is some more information about each category:

                      1. Animals: This is the best category for files related to animals, insects, or pets at home or in the wild.

                      2. Buildings and Architecture: This category is for all structures like homes, interiors, offices, temples, barns, factories, or shelters.

                      3. Business: includes business people, business offices, business concepts, finance, and money.

                      4. Drinks: includes the objects and culture of beer, wine, spirits, and other drinks.

                      5. The Environment: includes anything depicting nature or the surroundings we work and live in.

                      6. States of Mind: this category highlights content about our emotions and inner voice.

                      7. Food: any subject matter that focuses on food.

                      8. Graphic Resources: includes backgrounds, textures, and symbols.

                      9. Hobbies and Leisure: this category includes pastime activities that bring joy and/or relaxation, such as knitting, model airplanes, and sailing.

                      10. Industry: this category highlights work and manufacturing like building cars, forging steel, production of clothing, or production of energy.

                      11. Landscape: includes vistas, cities, nature, and other locations.

                      12. Lifestyle: highlights the environment and activity of people at home, work, and play.

                      13. People: displays all types of people—young, old, and ethnically diverse.

                      14. Plants and Flowers: features close-ups of the natural world.

                      15. Culture and Religion: depicts the traditions, beliefs, and cultures of people around the world.

                      16. Science: showcases content with a scientific focus on the applied, natural, medical, and theoretical sciences.

                      17. Social Issues: captures social issues like poverty, politics, and violence.

                      18. Sports: includes football, basketball, hunting, yoga, and skiing.

                      19. Technology: includes computers, smartphones, virtual reality, and tools to increase productivity.

                      20. Transport: highlights different types of transportation, including cars, buses, trains, planes, and highway systems.

                      21. Travel: features local and worldwide travel, culture, and lifestyle.
                    `
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

    // report usage to stripe
    await stripe.billing.meterEvents.create({
      event_name: 'keyworder_tokens',
      payload: {
        value: '1',
        stripe_customer_id: stripe_customer_id,
      },
    });

    return {
      ...metadata,
      fileName,
    };
  },
});
