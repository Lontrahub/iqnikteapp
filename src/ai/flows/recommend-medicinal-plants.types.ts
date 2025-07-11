/**
 * @fileOverview This file defines the types and schemas for the Mayan medicine guide AI flow.
 *
 * - UserQueryInputSchema / UserQueryInput: The input for the user query flow.
 * - UserQueryOutputSchema / UserQueryOutput: The output for the user query flow.
 */
import { z } from 'zod';

// Input and Output Schemas for the main flow
export const UserQueryInputSchema = z.object({
  query: z.string().describe('The user question or symptoms.'),
});
export type UserQueryInput = z.infer<typeof UserQueryInputSchema>;

export const UserQueryOutputSchema = z.object({
  answer: z
    .string()
    .describe(
      'The comprehensive answer to the user query, formatted in Markdown.'
    ),
});
export type UserQueryOutput = z.infer<typeof UserQueryOutputSchema>;
