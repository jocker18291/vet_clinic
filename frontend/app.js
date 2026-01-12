const express = require("express");
const app = express();

app.use(express.static("public")); // serwuj folder public

app.listen(3000, () => {
    console.log("Serwer działa na http://localhost:3000");
});
