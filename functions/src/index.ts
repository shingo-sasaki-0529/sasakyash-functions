import * as functions from "firebase-functions";
import Zaim from "zaim";

const zaim = new Zaim({
  consumerKey: process.env.ZAIM_KEY as string,
  consumerSecret: process.env.ZAIM_SECRET as string,
  accessToken: process.env.ZAIM_TOKEN as string,
  accessTokenSecret: process.env.ZAIM_TOKEN_SECRET as string,
});

export const helloWorld = functions.https.onRequest(async (_, response) => {
  const userInfo = await zaim.verify();
  response.json({ data: JSON.parse(userInfo) });
});
