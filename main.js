const fs = require("fs");
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");

const PORT = 3000;

app.use(express.static("public"));
app.set("view engine", "handlebars");
app.engine(
      "handlebars",
      handlebars({
            layoutsDir: __dirname + "/views/layouts",
      })
);

app.listen(PORT, () => {
      console.log(`App is listening on ${PORT}`);
});

app.get("/", (req, res) => {
      const scan = fs.readdirSync("./public");
      let outputHTML = "";
      scan.forEach((el) => {
            outputHTML += `<li>${el}</li>`;
      });
      res.render("./templates/index.handlebars");
});
