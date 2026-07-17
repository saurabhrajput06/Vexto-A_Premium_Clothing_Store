import connectDB from "./src/config/db.js";
import app from "./src/app.js";
import { config } from "./src/config/config.js";
const PORT = config.port;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });
