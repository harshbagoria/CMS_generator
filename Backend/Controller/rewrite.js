import {GoogleGenAI} from '@google/genai';
import dotenv from "dotenv";
dotenv.config();



const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
export const generatecontent = async (req, res) => {
    // const {prompt} = req.body;

    try {
       
    console.log(`content  generation start ${req.userId}`);
     const {prompt} = req.body;


      
    } catch (error) {
        console.error("Error generating content:", error);
        return res.status(500).json({ error: "Failed to generate content" });
    }
}

// const AI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
// const prompt = "Write a short story about a brave knight who saves a village from a dragon.";
// const response = await generategiminicontent(prompt);


// async function generategiminicontent(prompt) {
//   const response = await AI.models.generateContent({
//     model: 'gemini-2.5-flash',
//     contents: prompt,
//   });
//   console.log(response.text);
//   return res.status(200).json({message: "content generated sucessfully", content: response.text});
