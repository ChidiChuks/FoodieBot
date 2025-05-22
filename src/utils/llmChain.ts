import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { PromptTemplate } from "@langchain/core/prompts";

// Initialize LLM with proper configuration
const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.3,
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  // configuration: {
  //   organization: process.env.OPENAI_ORG_ID // Optional
  // }
});

// Define conversation prompt
const prompt = new PromptTemplate({
  inputVariables: ["input"],
  template: `You are FoodieBot, a friendly food ordering assistant. Respond to: {input}`
});

// Create conversation chain
export const conversationChain = new ConversationChain({
  llm,
  memory: new BufferMemory(),
  prompt,
  verbose: process.env.NODE_ENV === "development"
});