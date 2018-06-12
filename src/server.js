const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// handles any and all post requests determined in the onRequest function
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addCharacter') {
    const res = response;

    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addCharacter(request, res, bodyParams);
    });
  } else if (parsedUrl.pathname === '/saveCharacter') {
    const res = response;

    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.saveCharacter(request, res, bodyParams);
    });
  }
};

// handles any and all get requests determined in the onRequest function
const handleGet = (request, response, parsedUrl, params) => {
  if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/bundle.js') {
    htmlHandler.getBundle(request, response);
  } else if (parsedUrl.pathname === '/getCharacterList') {
    jsonHandler.getCharacterList(request, response);
  } else if (parsedUrl.pathname === '/showCharacter') {
    jsonHandler.showCharacter(request, response, params);
  } else {
    jsonHandler.notFound(request, response);
  }
};

// handles any and all head requests determined in the onRequest function
const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getCharacterList') {
    jsonHandler.getCharacterListMeta(request, response);
  } else { jsonHandler.notFoundMeta(request, response); }
};

// handles any and all delete requests determined in the onRequest function
const handleDelete = (request, response, parsedUrl, params) => {
  if (parsedUrl.pathname === '/deleteCharacter') {
    jsonHandler.deleteCharacter(request, response, params);
  } else {
    jsonHandler.notFound(request, response);
  }
};

// calls the appropriate function depending on the method sent with the request,
// also parses out the url and query parameters for those functions
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl, params);
  } else if (request.method === 'GET') {
    handleGet(request, response, parsedUrl, params);
  } else if (request.method === 'DELETE') {
    handleDelete(request, response, parsedUrl, params);
  } else {
    handleHead(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
