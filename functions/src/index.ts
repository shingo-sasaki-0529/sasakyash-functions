import { config, https } from "firebase-functions";
import Zaim from "zaim";

const zaimConfig = config().zaim;

const zaim = new Zaim({
  consumerKey: zaimConfig.key as string,
  consumerSecret: zaimConfig.secret as string,
  accessToken: zaimConfig.token as string,
  accessTokenSecret: zaimConfig.token_secret as string,
});

export const helloWorld = https.onRequest(async (_, response) => {
  const userInfo = await zaim.verify();
  response.json({ data: JSON.parse(userInfo) });
});
