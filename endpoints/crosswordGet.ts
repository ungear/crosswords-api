import { FastifyInstance } from "fastify";
import { CrosswordDto } from "../models/croswordDto";
import { CrosswordService } from "../services/crosswordService";
import { getRandomQuestions } from "../services/dataService";

const crosswordService = CrosswordService.getInstance();

export async function crosswordGet(server: FastifyInstance): Promise<any> {
  return server.get('/crossword', async (request, reply) => {
    const words = await getRandomQuestions(10);
    const crossword = crosswordService.generateCrossword(words);
    return new CrosswordDto(crossword);
  })
}