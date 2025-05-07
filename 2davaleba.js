//2) Create a server that handles products CRUD. create products.json and paste some products data.
// user should add/update/delete/get products. There should be pagination and also add filters like
// /posts?priceFrom=100&priceTo=300 should return all products within price range of 100-300.

const http = require("http");
const url = require("url");
const queryString = require("querystring");
const fs = require("fs/promises");
const { readFileAndParse } = require("./utils");

//product.json ის პროდუქტები ჯპიტის შევაქმნევინე.

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url);

  if (parsedUrl.pathname === "/posts" && req.method === "GET") {
    const query = queryString.parse(parsedUrl.query);
    console.log(req.url, "req.url");
    console.log(query, "query");

    let priceFrom = Number(query.priceFrom);
    let priceTo = Number(query.priceTo);

    if (!query.priceFrom && !query.priceTo) {
      res.writeHead(400, {
        "content-type": "application/json",
      });

      res.end(
        JSON.stringify({
          message: "parameters are required, priceFrom and priceTo",
        })
      );
      return;
    }

    try {
      const fileContent = await fs.readFile("products.json", "utf-8");
      const products = JSON.parse(fileContent);

      const filteredProducts = products.filter(
        (product) => product.price >= priceFrom && product.price <= priceTo
      );

      res.writeHead(200, {
        "content-type": "application/json",
      });

      res.end(JSON.stringify(filteredProducts));
    } catch (err) {
      console.error("Error reading or filtering products:", err);
      res.writeHead(500, {
        "content-type": "application/json",
      });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  }

  if (parsedUrl.pathname === "/posts" && req.method === "POST") {
    const query = queryString.parse(parsedUrl.query);
    const { name, price } = query;

    if (!name || !price) {
      res.writeHead(400, {
        "content-type": "application/json",
      });

      res.end(JSON.stringify({ message: "name and price are required" }));
      return;
    }

    try {
      const fileContent = await fs.readFile("products.json", "utf-8");
      const products = JSON.parse(fileContent);
      const lastId = products[products.length - 1]?.id || 0;

      const newProduct = {
        id: lastId + 1,
        name: name,
        price: Number(price),
      };

      products.push(newProduct);

      await fs.writeFile("products.json", JSON.stringify(products, null, 2));

      res.writeHead(201, {
        "content-type": "text/plain",
      });

      res.end("product created successfully");
    } catch (err) {
      console.error("Error creating product:", err);
      res.writeHead(500, {
        "content-type": "application/json",
      });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  }

  if (parsedUrl.pathname === "/delete" && req.method === "DELETE") {
    const query = queryString.parse(parsedUrl.query);
    const id = query.id;

    if (!id) {
      res.writeHead(400, {
        "content-type": "application/json",
      });
      res.end(JSON.stringify({ message: "id is required" }));
      return;
    }

    try {
      const fileContent = await fs.readFile("products.json", "utf-8");
      const products = JSON.parse(fileContent);

      const filteredProducts = products.filter(
        (product) => product.id !== Number(id)
      );

      if (filteredProducts.length === products.length) {
        res.writeHead(404, {
          "content-type": "application/json",
        });
        res.end(JSON.stringify({ message: `Product with id ${id} not found` }));
        return;
      }

      await fs.writeFile(
        "products.json",
        JSON.stringify(filteredProducts, null, 2)
      );

      res.writeHead(200, {
        "content-type": "application/json",
      });
      res.end(
        JSON.stringify({
          message: `Product with id ${id} deleted successfully`,
        })
      );
    } catch (err) {
      res.writeHead(500, {
        "content-type": "application/json",
      });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  }
});

server.listen(5000, () => {
  console.log(`Your server is running on http://localhost:5000`);
});
