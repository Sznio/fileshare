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

      req.decodedPath = decodeURI(req.path);

      if (!fs.existsSync(`./public${req.decodedPath}`)) {
            // console.log(req);
            return res.send(403);
      }
      const statsObj = fs.statSync(`./public${req.decodedPath}`);

      let uniformPath =
            req.decodedPath +
            (req.decodedPath[req.decodedPath.length - 1] == "/" ? "" : "/");

      if (statsObj.isDirectory()) {
            //! Handle folder logic
            const scan = fs.readdirSync(`./public${req.decodedPath}`);
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

            let fileName;
            let extension;
            let splitFileName = null;
            //? If has extension

            if (req.decodedPath.includes(".")) {
                  splitFileName = [
                        req.decodedPath.slice(
                              0,
                              req.decodedPath.lastIndexOf(".")
                        ),
                        ".",
                        req.decodedPath.slice(
                              req.decodedPath.lastIndexOf(".") + 1
                        ),
                  ];
                  [fileName, , extension] = splitFileName;
            } //? End if has extension
            else {
                  fileName = req.decodedPath;
                  extension = "";
            }

            const peekBuffer = Buffer.alloc(maxSmallFileSize);
            const fd = fs.openSync(`./public/${req.decodedPath}`);

            fs.read(fd, peekBuffer, 0, maxSmallFileSize, 0, (err, bytes) => {
                  if (err) {
                        return res.send(500);
                  }
                  //! Read successfully
                  let peek = peekBuffer.toString("utf-8");

                  res.render("filepage", {
                        title: splitFileName?.join() || fileName,
                        peek,
                        path: uniformPath,
                        fileNameAndPath: fileName,
                        fileName: fileName.slice(fileName.lastIndexOf("/") + 1),
                        extension,
                        size,
                        remaining: size - maxSmallFileSize,
                        bigFile: size > maxSmallFileSize,
                        downloadPath: `/download${req.decodedPath}`,
                  });
            });
      }
});
