const fs = require("fs");
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const path = require("path");

const PORT = 3000;

// app.use(express.static("public"));
app.use(express.static("css"));

app.set("view engine", "pug");

app.listen(PORT, () => {
      console.log(`App is listening on ${PORT}`);
});

app.get("/download/*", (req, res) => {
      const relFilePath = "/public" + req.path.slice(9);

      console.log(`User is trying to download: ${relFilePath}`);
      res.download(path.join(__dirname, relFilePath));
});

app.get("/*", (req, res) => {
      console.log("Got a req on /*");
      if (!fs.existsSync(`./public${req.path}`)) {
            // console.log(req);
            return res.send(403);
      }
      const statsObj = fs.statSync(`./public${req.path}`);

      let uniformPath =
            req.path + (req.path[req.path.length - 1] == "/" ? "" : "/");

      if (statsObj.isDirectory()) {
            //! Handle folder logic
            const scan = fs.readdirSync(`./public${req.path}`);
            let processedArray = [];
            scan.forEach((el) => {
                  if (el.indexOf(".") == -1) {
                        processedArray.push([el]);
                        return;
                  }
                  processedArray.push([
                        el.slice(0, el.lastIndexOf(".")),
                        el.slice(el.lastIndexOf(".") + 1),
                  ]);
            });
            console.log(processedArray);

            res.render("index", { processedArray, path: uniformPath });
      } else {
            //? Handle file logic
            const { size } = statsObj;
            const maxSmallFileSize = 300;

            const splitFileName = [
                  req.path.slice(0, req.path.lastIndexOf(".")),
                  ".",
                  req.path.slice(req.path.lastIndexOf(".") + 1),
            ];

            const [fileName, , extension] = splitFileName;

            const peekBuffer = Buffer.alloc(maxSmallFileSize);
            const fd = fs.openSync(`./public/${req.path}`);

            fs.read(fd, peekBuffer, 0, maxSmallFileSize, 0, (err, bytes) => {
                  if (err) {
                        return res.send(500);
                  }
                  //! Read successfully
                  let peek = peekBuffer.toString("utf-8");

                  res.render("filepage", {
                        title: splitFileName.join(),
                        peek,
                        path: uniformPath,
                        fileNameAndPath: fileName,
                        fileName: fileName.slice(fileName.lastIndexOf("/") + 1),
                        extension,
                        size,
                        remaining: size - maxSmallFileSize,
                        bigFile: size > maxSmallFileSize,
                        downloadPath: `/download${req.path}`,
                  });
            });
      }
});
