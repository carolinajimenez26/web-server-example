const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  let message = {
    name: 'Carolina',
    url: req.url
  };
  // res.write("Hello world");
  res.write(JSON.stringify(message));
  res.end();
}).listen(8080);

console.log(`Listening on port 8080`);
