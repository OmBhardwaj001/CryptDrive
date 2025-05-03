import fs from "fs"

 function remove(path){
    try{
        fs.unlinkSync(path);
        console.log("file removed");
    }
    catch(error){
        console.log("file removal failed", error);
    }
 }
 
 export default remove;