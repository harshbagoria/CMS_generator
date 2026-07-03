export const image = async(req,res)=>{
    console.log("image genrating start ");
    try{
         
    }catch(error){
        console.error("Error is image generating" , error);
        res.status(500).json({"message": "Internal server error"});


    }

}