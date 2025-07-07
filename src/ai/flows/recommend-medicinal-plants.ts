'use server';
/**
 * @fileOverview This file defines a Genkit flow for recommending medicinal plants based on user-provided symptoms.
 *
 * - recommendMedicinalPlants - A function that takes user symptoms as input and returns a list of recommended medicinal plants with descriptions.
 * - RecommendMedicinalPlantsInput - The input type for the recommendMedicinalPlants function.
 * - RecommendMedicinalPlantsOutput - The return type for the recommendMedicinalPlants function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendMedicinalPlantsInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms experienced by the user.'),
});
export type RecommendMedicinalPlantsInput = z.infer<typeof RecommendMedicinalPlantsInputSchema>;

const RecommendMedicinalPlantsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      plantName: z.string().describe('The name of the recommended plant.'),
      description: z.string().describe('A brief description of the plant and its medicinal uses.'),
    })
  ).describe('A list of medicinal plant recommendations.'),
});
export type RecommendMedicinalPlantsOutput = z.infer<typeof RecommendMedicinalPlantsOutputSchema>;

export async function recommendMedicinalPlants(input: RecommendMedicinalPlantsInput): Promise<RecommendMedicinalPlantsOutput> {
  return recommendMedicinalPlantsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendMedicinalPlantsPrompt',
  input: {schema: RecommendMedicinalPlantsInputSchema},
  output: {schema: RecommendMedicinalPlantsOutputSchema},
  prompt: `You are a knowledgeable guide on Mayan medicinal plants.

  Based on the user's symptoms, recommend a list of medicinal plants with descriptions of their uses.

  Symptoms: {{{symptoms}}}
  `,
});

const recommendMedicinalPlantsFlow = ai.defineFlow(
  {
    name: 'recommendMedicinalPlantsFlow',
    inputSchema: RecommendMedicinalPlantsInputSchema,
    outputSchema: RecommendMedicinalPlantsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
