require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const cors = require("cors");

connectToDB()
app.use(
  cors({
    origin: "https://ai-resume-analyser-frontend-49oe.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
); 


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});