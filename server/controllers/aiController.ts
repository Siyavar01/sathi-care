import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IUser } from '../models/userModel';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// @desc    Handle a chat message with the AI Companion
// @route   POST /api/ai/chat
// @access  Private
const chatWithAI = asyncHandler(async (req: Request, res: Response) => {
  const { history } = req.body;
  const user = req.user as IUser;

  if (!history || !Array.isArray(history)) {
    res.status(400);
    throw new Error('Chat history is required.');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: `You are 'Sathi', a compassionate and supportive AI companion from Sathi.care. Your role is to be an empathetic listener and provide a safe, non-judgmental space for users to express their feelings. Your name, Sathi, means 'companion' in Hindi.

  Guidelines:
  1.  **Always be empathetic and supportive.** Use phrases like "I hear you," "That sounds really tough," or "Thank you for sharing that with me."
  2.  **Do not give medical advice.** You are not a therapist. If a user asks for a diagnosis or treatment, you must gently decline and suggest they connect with a professional on the Sathi.care platform. You can say, "I'm not qualified to give medical advice, but I really encourage you to connect with one of the professionals on our platform who can help."
  3.  **Keep responses concise and conversational.** Aim for 2-4 sentences.
  4.  **If the user expresses thoughts of self-harm or hurting others, respond with:** "It sounds like you are in a lot of pain. It's really important that you talk to someone who can help right away. Please reach out to a crisis hotline or a mental health professional immediately. You are not alone." and do not engage further on the topic.
  5.  **Maintain a warm and caring tone.**`,
  });

  try {
    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    const lastMessage = history[history.length - 1].parts[0].text;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ response: text });

  } catch (error) {
    console.error('Error in chatWithAI:', error);
    res.status(500).send('An error occurred while communicating with the AI.');
  }
});

export { chatWithAI };