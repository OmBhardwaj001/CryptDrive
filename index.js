import express, { urlencoded } from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"

dotenv.config()
const app = express();

app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:8000'
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))


const port = process.env.PORT || 8000;


app.get('/',(req,res)=>
{
    res.send("welcome to home page")
})

app.listen(port,()=>
{
    console.log(`server is listening at port no ${port}`);
})
