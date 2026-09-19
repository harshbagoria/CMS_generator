import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
import { writeFileSync, appendFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { RESOLUTION_MAP } from "../Utils/Constant.js";
import cloudinary from "cloudinary";
import Image from "../Models/image.js";


dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const DEBUG_LOG = join(__dirname, '..', '..', 'debug-2b0719.log');
const agentLog = (payload) => {
  // #region agent log
  const line = JSON.stringify({ sessionId: '2b0719', timestamp: Date.now(), ...payload });
  try { appendFileSync(DEBUG_LOG, line + '\n'); } catch (_) {}
  fetch('http://127.0.0.1:7432/ingest/3732173b-59b0-45d3-9d20-e063cecbe55e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'2b0719'},body:line}).catch(()=>{});
  // #endregion
};

const client = new InferenceClient(process.env.AI_API_KEY);
//console.log("API key", process.env.AI_API_KEY);


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// const image = await client.textToImage({
//     // provider: "auto",
//     // model: "black-forest-labs/FLUX.1-schnell",
// 	// inputs: "Astronaut riding a horse",
	

  



// });
/// Use the generated image (it's a Blob)
export const generateImage = async(req,res)=>{
    console.log("image genrating start ");
    try{

        const {prompt, resolution} = req.body;
        console.log("prompt and resolution", prompt, resolution);
          if(!prompt || !resolution){
        return res.status(400).json({"message": "prompt and  resolution are required"});

    }
        if(!process.env.AI_API_KEY){
            return res.status(500).json({"message": "AI API key is not configured"});
            
        }


        console.log(`prompt ${prompt} and resolution is ${resolution}`);

const dimension = RESOLUTION_MAP[resolution] || RESOLUTION_MAP["512x512"];
console.log("calling  is ", {prompt ,resolution, dimension});

 


const image =  await generateimageblob(prompt, dimension);
const buffer = Buffer.from(await image.arrayBuffer());
const upload_generated_image = await uploadimage(buffer);
console.log("upload image result is ", upload_generated_image,req.userId);
        agentLog({runId:'post-fix',hypothesisId:'A',location:'Controller/image.js:beforeCreate',message:'userId value about to be saved',data:{userIdType:typeof req.userId,isObject:req.userId!==null&&typeof req.userId==='object',userIdString:typeof req.userId==='string'?String(req.userId):undefined,hasCloudinaryUrl:Boolean(upload_generated_image?.secure_url)}});

const result = await Image.create({
    imageUrl : upload_generated_image.secure_url,
    prompt : prompt,
    userId : req.userId
});
        agentLog({runId:'post-fix',hypothesisId:'A',location:'Controller/image.js:afterCreate',message:'Image.create succeeded',data:{savedId:String(result?._id||''),savedUserId:String(result?.userId||'')}});

//writeFileSync("image.png", buffer);
// res.status(200).json({"message": "image generated successfully" , "image": buffer.toString("base64")});
//res.status(200).set("Content-Type", "image/png").send(buffer);

return res.status(200).json({
    message: "image generated successfully",
    image: upload_generated_image.secure_url,
  });


         
    }catch(error){
       // agentLog({runId:'post-fix',hypothesisId:'A',location:'Controller/image.js:catch',message:'generateImage failed',data:{errorName:error?.name,errorMessage:error?.message,userIdType:typeof req.userId}});
        console.error("Error is image generating" , error);
         return res.status(500).json({"message": "Internal server error"});


    }

  

    



}

async function generateimageblob(prompt , dimension) {

 return  await client.textToImage({
      provider: "auto",
     model: "black-forest-labs/FLUX.1-schnell",
      inputs: prompt,
      parameters: { num_inference_steps: 5 , width:dimension.width , height:dimension.height },

	
    
})
}

const uploadimage = async(buffer)=>{
//const byteArrayBuffer = fs.readFileSync('people.mp4');
return  await new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream({ resource_type: "image"  , folder: "generated_images"}, (error, uploadResult) => {
        if (error) {
            return reject(error);
        }
        return resolve(uploadResult);
    }).end(buffer);
});

}
