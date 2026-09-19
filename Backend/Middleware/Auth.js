import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
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

export const auth =  async (req , res ,next) =>{
  try{
    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status (401).json({"message":"Unauthorization"});
    }
    const decoded = jwt.verify(token, process.env.secret_key);
    agentLog({runId:'post-fix',hypothesisId:'A',location:'Middleware/Auth.js:12',message:'JWT decoded shape before setting req.userId',data:{decodedType:typeof decoded,decodedKeys:decoded&&typeof decoded==='object'?Object.keys(decoded):[],hasNestedUserId:Boolean(decoded&&decoded.userId),nestedUserIdType:decoded&&decoded.userId?typeof decoded.userId:'none',assignedUserIdType:typeof decoded?.userId}});
    // Fix: store only the ObjectId string, not the whole JWT payload object
    req.userId = decoded.userId;

    next();

  }catch(error){
    agentLog({runId:'post-fix',hypothesisId:'D',location:'Middleware/Auth.js:catch',message:'Auth middleware error',data:{errorName:error?.name,errorMessage:error?.message}});
    return res.status(500).json({"message":"internal server error"});


  }
  
  
}