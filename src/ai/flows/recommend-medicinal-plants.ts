
'use server';
/**
 * @fileOverview This file defines a Genkit flow for a knowledgeable Mayan medicine guide.
 *
 * - answerUserQuery - A function that takes a user's query and uses tools to answer questions about plants and articles.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {
  getAllPlants,
  getPlantById,
  getAllBlogs,
  getBlogById,
} from '@/lib/data';
import {
  UserQueryInputSchema,
  type UserQueryInput,
  UserQueryOutputSchema,
  type UserQueryOutput,
} from './recommend-medicinal-plants.types';

// Schemas for Tools
const PlantSchema = z.object({
  id: z.string(),
  name: z.object({en: z.string(), es: z.string()}),
  scientificName: z.string().optional(),
  description: z.object({en: z.string(), es: z.string()}),
});
const BlogSchema = z.object({
  id: z.string(),
  title: z.object({en: z.string(), es: z.string()}),
  content: z.object({en: z.string(), es: z.string()}),
});

// Tool Definitions
const listPlants = ai.defineTool(
  {
    name: 'listPlants',
    description: 'List all available medicinal plants.',
    outputSchema: z.array(z.object({id: z.string(), name: z.string()})),
  },
  async () => {
    const plants = await getAllPlants();
    // For listing, we only need basic info.
    return plants.map(p => ({id: p.id, name: p.name.en}));
  }
);

const getPlantDetails = ai.defineTool(
  {
    name: 'getPlantDetails',
    description: 'Get detailed information for a specific plant by its ID.',
    inputSchema: z.object({id: z.string()}),
    outputSchema: PlantSchema,
  },
  async ({id}) => {
    const plant = await getPlantById(id);
    if (!plant) throw new Error('Plant not found');
    return {
      id: plant.id,
      name: plant.name,
      scientificName: plant.scientificName,
      description: plant.description,
    };
  }
);

const listArticles = ai.defineTool(
  {
    name: 'listArticles',
    description: 'List all available articles and educational content.',
    outputSchema: z.array(z.object({id: z.string(), title: z.string()})),
  },
  async () => {
    const blogs = await getAllBlogs();
    return blogs.map(b => ({id: b.id, title: b.title.en}));
  }
);

const getArticleDetails = ai.defineTool(
  {
    name: 'getArticleDetails',
    description: 'Get the full content for a specific article by its ID.',
    inputSchema: z.object({id: z.string()}),
    outputSchema: BlogSchema,
  },
  async ({id}) => {
    const blog = await getBlogById(id);
    if (!blog) throw new Error('Article not found');
    return {
      id: blog.id,
      title: blog.title,
      content: blog.content,
    };
  }
);

// The Flow itself
export async function answerUserQuery(
  input: UserQueryInput
): Promise<UserQueryOutput> {
  return answerUserQueryFlow(input);
}

const guidePrompt = ai.definePrompt({
  name: 'guidePrompt',
  input: {schema: UserQueryInputSchema},
  output: {schema: UserQueryOutputSchema},
  tools: [listPlants, getPlantDetails, listArticles, getArticleDetails],
  prompt: `You are a wise and friendly guide, deeply connected to Mayan culture and its medicinal traditions. You are passionate about sharing this knowledge.
  Your main goal is to answer the user's question based strictly on the information available in your tools (the provided plants and articles).

  Your personality:
  - You are an expert on Mayan medicinal plants and culture. Share interesting facts when relevant.
  - You love to help people learn. Enthusiastically recommend articles when they are relevant to the user's query.
  - Always be helpful and encouraging.

  How to answer:
  - If the user describes symptoms, recommend relevant plants and articles using your tools.
  - If the user asks about a specific topic, use your tools to find the information and present it clearly.
  - If you cannot find a direct answer, do not use external knowledge. Instead, suggest related articles or plants from your tools that the user might find interesting. For example, "While I don't have information on that specific topic, you might find our article on '[Related Article Title]' helpful."
  - Always format your answers using Markdown.

  User Query: {{{query}}}
  `,
});

const answerUserQueryFlow = ai.defineFlow(
  {
    name: 'answerUserQueryFlow',
    inputSchema: UserQueryInputSchema,
    outputSchema: UserQueryOutputSchema,
  },
  async input => {
    const {output} = await guidePrompt(input);
    if (!output) {
      return {
        answer:
          "I'm sorry, I couldn't find an answer for that. Please try rephrasing your question.",
      };
    }
    return output;
  }
);
