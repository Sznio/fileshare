const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.static("public"));

const PORT = 3000;

app.listen(PORT, () => {
      console.log(`App is listening on ${PORT}`);
});

app.get("/", (req, res) => {
      const scan = fs.readdirSync("./public");
      let outputHTML = "";
      scan.forEach((el) => {
            outputHTML += `<li>${el}</li>`;
      });
      res.render("./templates/index.handlebars", { scan: scan });
});
