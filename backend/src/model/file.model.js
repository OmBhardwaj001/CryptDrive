import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    size:{
        type:String,
        required:true,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    description:{
        type:String,
    },
  
},{timestamps:true});

const File = mongoose.model("File",fileSchema);

export default File;

