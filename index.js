const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate.js');

///////////////////////////////////////
////------------FILES------------////
// Blocking, synchronous way
// read the input.txt file
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8'); 
// const textOut = `This is the what we know about avocado: ${textIn} \nCraeted on ${new Date()}`;

// write the output.txt file
// const textOutput = fs.writeFileSync("./txt/output.txt", textOut);

// Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//     if(err) return console.log("ERROR! 💥");

//     fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//         fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//             console.log("data3:>>", data3);

//             fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", err => {
//                 console.log("File written sucessfully 🤝");
//             })
//         })
//     })
// })
// console.log("Will write the file ??????");


////------------SERVER------------////

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
// const pathName = req.url;
const { pathname, query } = url.parse(req.url, true);
console.log("pathh:>>", pathname, query);

    
    // Overview page
    if(pathname === "/" || pathname === "/overview") {
        const cardsHtml = dataObj.map( el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%', cardsHtml);
        res.writeHead(200, { 'Content-type': 'text/html' })
        res.end(output);

    // Product page
    } else if(pathname === "/product") {
       const product = dataObj[query.id];
       const output = replaceTemplate(tempProduct, product); 
        res.writeHead(200, { 'Content-type': 'text/html' })
        res.end(output);

    // API
    } else if(pathname === "/api") {
        res.writeHead(200, { 'Content-Type': 'application/json' })            
        res.end(data);

    // not found
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-own-header': 'hello-world-again'
        })
        res.end("<h1>Page not found! 404</h1>");
    }
});

server.listen(8003, "127.0.0.1", () => {
    console.log("Server listening to port 8003!!!")
})
