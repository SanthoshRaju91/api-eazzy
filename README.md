# API eazzy

Let's face it, integrating an API service with a UI is never an easy job. There is a lot of to and forth communication that happens when there is an integration phase in your project.

At times, there won't be any communication. Yes and this usually happens when the service team is working on their response and you as a UI engineer is idle.

Waiting for an finite amount of time, so that the services are ready.

There are times where the response model is finalized during the planning / grooming phase, but still the service is not ready.

Yes your answer would be to have mocker, that's what this is, but with a hint of more flexibility and an additional feature.

# Install

`npm install api-eazzy`

## Mock

First module available to you when using the API eazzy, is `mock(req, res);`

This functions, expects your project to have two things in your root of the project.

`mocks` folder having all the API mocks

`mapper.json` mapping your API url to the mocks

```
{
    "users": {
    "method": "GET",
    "path": "users.json"
  }
}
```

url is usually the key, in this case it is `users`, so when a request to `users` is received, it will schema the file `users.json` in `mocks` directory

As simple as that you can get.

## Proxy

Ever got the irritating `CORS` issue in the UI, while integrating.

(If you don't know what CORS is [check here](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS))

Also, when you are working in local dev environment, have you ever tried to connect to a services which is protected `https`

Something it might allow you, something not.

Will we solve these problems with the `proxy(req, res)` function

All you have to do is have a `proxy.json` in root of your project directory, with following variables (Mandatory)

```
{
  "protocol": "https",
  "hostname": "jsonplaceholder.typicode.com"
}
```

And that's it, you make your calls from UI to the proxy server, in that same you make calls to actual domain.

No more CORS / https headaches

## Note

We only provide you the two function `mock(req, res)` & `proxy(req, res)`.

But you actually need to integrate them with a acutal node server, a small example of it is below.

You can integrate them is any way you, maybe even conditionally as well. The freedom to how you integrate is given to you.

```javascript
const http = require("http");
const { proxy, mock } = require("../src/index");

http
  .createServer((req, res) => {
    // use an one of them
    proxy(req, res);
    // mock(req, res);
  })
  .listen(3000, () => console.log(`Listening on server 3000`));
```

If you feel you can improve on the documentation or the functionality of the API's. Please feel free to raise a Pull Request.
