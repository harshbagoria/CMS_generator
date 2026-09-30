import {GoogleGenAI} from '@google/genai';
import content from '../Models/content';
import dotenv from "dotenv";
dotenv.config();



const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
export const generatecontent = async (req, res) => {
    // const {prompt} = req.body;

    try {
       
    console.log(`content  generation start ${req.userId}`);
     const {prompt} = req.body;
    if(!prompt){
        return res.status(400).json({"message": "prompt is required"});

    }
    

    const user_prompt = `Rewrite the following content in a more engaging and creative way: ${prompt}`;


     
    const generated_Result = await generategiminicontent(user_prompt);




    const result = content.create({
        userId: req.userId,
        Input_prompt: prompt,
        generated_content: generated_Result,
        type: "generate"




    })

    return res.status(200).json({message: "content generated sucessfully", content: generated_Result});





      
    } catch (error) {
        console.error("Error generating content:", error);
        return res.status(500).json({ error: "Failed to generate content" });
    }
}

const AI = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
//const prompt = "Write a short story about a brave knight who saves a village from a dragon.";



async function generategiminicontent(prompt) {
  const response = await AI.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  console.log(response.text);
  return response.text;
}