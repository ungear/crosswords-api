import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

export class AIService {
  private static instance: AIService;
  private openai: OpenAI;

  private constructor() {
    this.openai = new OpenAI({
      organization: process.env.OPEN_AI_ORGANIZATION,
      project: process.env.OPEN_AI_PROJECT,
      apiKey: process.env.OPEN_AI_API_KEY,
    });
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  public async getAnswerForWords(words: string[]) {
    const vocabilary = "A2";
    const wordsForPrompt = words.join(", ");
    const attemptsNumber = 3;
    const prompt = `
      I'm composing the corssword. 
      I need to find the clues for the words: "${wordsForPrompt}". 
      Please provide the clues. The clues should be in Spanish. 
      Use only ${vocabilary} vocabulary. 
      A clue should not contain information about the number of letters or the position of the letters in the word.
      Give the clues in the following JSON format: 
      [["word1", "clue1"],["word2", "clue2"]]
      `;

    let attemptsLeft = attemptsNumber;
    let result: string[][] | null = null;
    while (attemptsLeft > 0) {
      try {
        const response = await this.askOpenAi(prompt);
        const rawClues = response.choices[0].message.content;
        console.log(rawClues);
        result = rawClues ? JSON.parse(rawClues) as string[][] : null;
        return result;
      } catch (error) {
        attemptsLeft--;
        console.log("Error asking OpenAI", error);
      }
    }
    return null;
  }

  private async askOpenAi(prompt: string) {
    return await this.openai.chat.completions.create({
      messages: [{ 
        role: "user", 
        content: prompt }],
      model: "gpt-3.5-turbo",
    });
  }
}