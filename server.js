const app =require('./src/app');
const connectDb=require('./src/config/db.config');
connectDb();
app.listen(3000,()=>{
    console.log("the server is running on //localhost:3000");
});