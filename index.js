const http = require('http');
const url = require('url');
const axios = require('axios');
const jsonData = {};
const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === '/service/number' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(jsonData));
  }

  else if (reqUrl.pathname === '/service/number' && req.method === 'POST') {
    const urlList = reqUrl.query.urls;
    if (urlList && typeof urlList === 'string') {
      const urlsToAdd = urlList.split(',').map((str) => str.trim());
      const validUrls = urlsToAdd.filter((urlStr) => isValidURL(urlStr));

      for (const url of validUrls) {
        try {
          const response = await axios.get(url);
          jsonData[url] = response.data;
        } catch (error) {
          console.error(`Error fetching data from ${url}: ${error.message}`);
        }
      }

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'JSON data added successfully' }));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid input' }));
    }

  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

function isValidURL(urlStr) {
  try {
    new URL(urlStr);
    return true;
  } catch (err) {
    return false;
  }
}

const port = 8008;
server.listen(port, () => {
  console.log(`Number Management Service is running on http://localhost:${port}`);
});
