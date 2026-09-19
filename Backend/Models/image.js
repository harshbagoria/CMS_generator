import mongoose from "mongoose";
const imageSchema = new mongoose.Schema({
    userId:{
        required:true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    },
    imageUrl:{
        required:true,
        type: String

    },
   prompt:{
        required:true,
        type: String

   },

    
    }
   

)
 const Image = mongoose.model("Image", imageSchema);
   export default Image;
   