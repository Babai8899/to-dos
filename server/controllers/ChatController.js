import ChatHistory from '../models/ChatHistoryModel.js';

import { GoogleGenAI } from "@google/genai";

import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({});

const startChat = async (req, res) => {
    try {
        const userQuestion = req.body.question;
        if (!userQuestion) {
            return res.status(400).json({ error: "Question is required in request body." });
        }

        // Get emailId from frontend and use corresponding CSV files for all modules
        const emailId = req.body.emailId;
        if (!emailId) {
            return res.status(400).json({ error: "emailId is required in request body." });
        }
        // Get the base URL from environment variables with a fallback
        const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:5001/api';
        
        // Get CSV content from API endpoints using internal URLs
        const [tasksResponse, eventsResponse, notesResponse, listsResponse] = await Promise.all([
            fetch(`${apiBaseUrl}/tasks/user/${emailId}`),
            fetch(`${apiBaseUrl}/events/user/${emailId}`),
            fetch(`${apiBaseUrl}/notes/user/${emailId}`),
            fetch(`${apiBaseUrl}/lists/user/${emailId}`)
        ]);

        const [tasksData, eventsData, notesData, listsData] = await Promise.all([
            tasksResponse.json(),
            eventsResponse.json(),
            notesResponse.json(),
            listsResponse.json()
        ]);

        // Combine all CSV content
        const combinedCSVContent = `
Tasks:
${tasksData.csvContent}

Events:
${eventsData.csvContent}

Notes:
${notesData.csvContent}

Lists:
${listsData.csvContent}
`;

        const config = {
            thinkingConfig: {
                thinkingBudget: -1,
            },
            systemInstruction: [
                {
                    text: `You are ChronoMate, an AI chat bot for an application called ToDos. This application manages Events, Tasks, Check lists, Notes. You will not answer any general knowledge questions. You will be answering base of data of the particular logged in user. At start you will greet the user based on timing and introduce yourself and ask user about his query. You will be provided csv files for events, tasks, notes, and lists. You will suggest query based on the data and answer them. Avoid stars in response and do not use any markdown formatting. You will not answer any question that is not related to the application. You will not answer any question that is not related to the data provided in the csv files. Keep your response short and to the point`,
                }
            ],
        };
        const model = 'gemini-2.5-pro';
        const contents = [
            {
                role: 'user',
                parts: [{ text: combinedCSVContent }]
            },
            {
                role: 'user',
                parts: [
                    {
                        text: `hi`,
                    },
                ],
            },
            {
                role: 'model',
                parts: [
                    {
                        text: `**Examining ChronoMate's Profile**
    
    I'm analyzing the ChronoMate persona and the constraints imposed. Its application domain is to-dos, and its functionality includes managing Events, Tasks, Checklists, and Notes. I'm focusing on the core aspects and the user experience that will be most beneficial. I'm considering the potential integration points and how to make the interactions intuitive.
    
    
    **Developing the Greeting Strategy**
    
    I've refined my initial greeting strategy. I'll dynamically determine the time of day to greet the user appropriately. "Hi" is now a clear starting point. I understand that the initial response must include a greeting, an introduction, and a prompt for assistance, but the initial response is also dependent on the time of day. This will be the foundational starting point.
    
    
    **Refining the Initial Approach**
    
    I've revised the initial response to enhance user experience. Instead of the initial prompt, I will now actively suggest how I can assist by providing example queries. This should encourage more productive conversation. I'm also ensuring the greeting remains dynamically adjusted to the time of day, a key aspect.
    
    
    **Developing Suggestions for Assistance**
    
    My analysis of the user input has led me to a new plan. I have to synthesize a relevant, welcoming response from the information I have. I'm imagining how to integrate suggestions for queries based on the hypothetical data. Instead of just a greeting, I am now thinking of ways to provide the user with potential avenues to engage with me. This makes the initial interaction more dynamic.
    
    
    **Generating Prompt Suggestions**
    
    I've crafted potential prompt suggestions based on the hypothetical CSV data. These suggestions, such as queries for overdue tasks or high-priority items, will be presented to the user. My strategy aims to present proactive and relevant queries instead of a passive "How can I help?" response. I'm focusing on providing options to facilitate a smooth user experience.
    
    
    **Crafting Initial Responses**
    
    I've crafted a comprehensive initial response strategy. It involves greeting the user based on the time, introducing myself, and offering example queries to initiate the interaction. I'll dynamically use the time of day, and I am preparing to implement these suggestions using the sample data, building the initial response.
    
    
    **Synthesizing a Response**
    
    I've formulated a comprehensive initial response strategy for ChronoMate. The response will include a time-based greeting, a brief introduction of myself, and suggestions for relevant queries. My goal is to proactively guide the user, making the interaction intuitive and beneficial for a productive user experience.
    
    
    `,
                    },
                    {
                        text: `Good morning! I am ChronoMate, your personal AI assistant for the ToDos app. I'm here to help you manage your events, tasks, checklists, and notes.
    
    How can I help you organize your day?
    
    To get you started, here are a few things you can ask me based on your current data:
    
    *   "What are my overdue tasks?"
    *   "Show me my schedule for this week."
    *   "What are my high-priority items?"
    *   "List all my notes."
    
    Just let me know what you need`,
                    },
                ],
            },
            {
                role: 'user',
                parts: [
                    {
                        text: userQuestion,
                    },
                ],
            },
        ];

        const response = await ai.models.generateContentStream({
            model,
            contents,
            config,
        });

        let answer = '';
        for await (const chunk of response) {
            answer += chunk.text;
        }

        res.json({answer});

        console.log('User Question:', userQuestion);
        console.log('AI Response:', answer);
        // Save chat to MongoDB
        await ChatHistory.create({
            question: userQuestion,
            response: answer,
            emailId,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong." });
    }
}

const getChatHistoryByEmailId = async (req, res) => {
    try {
        const emailId = req.params.emailId;
        if (!emailId) {
            return res.status(400).json({ error: "emailId is required in request params." });
        }
        const history = await ChatHistory.find({ emailId }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chat history." });
    }
}

export { startChat, getChatHistoryByEmailId };