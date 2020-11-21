import * as functions from "firebase-functions";

export const helloWorld = functions.https.onRequest((_, response) => {
  response.json({ data: { message: "Hello, World from functions!!" } });
});
