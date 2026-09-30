import mongoose from "mongoose";
const ContentSchema = new mongoose.Schema({
    userId:{
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    },
    
    Input_prompt:{
        required:true,
        type: String,
        trim:true
    },
    generated_content:{
        required:true,
        type: String,
        trim:true



   },
   type:{
        required:true,
        type: String,
        enum:["rewrite","expend","explain","summarize","translate","generate"]

   }

    
    }
   

)
 const Content = mongoose.model("Content", ContentSchema);
   export default Content;
   