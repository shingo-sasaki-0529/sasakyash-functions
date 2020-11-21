import { config } from "firebase-functions";
import { Money, MoneyType, PaymentType } from "./types";
import Zaim from "zaim";

const zaimConfig = config().zaim;
const zaim = new Zaim({
  consumerKey: zaimConfig.key as string,
  consumerSecret: zaimConfig.secret as string,
  accessToken: zaimConfig.token as string,
  accessTokenSecret: zaimConfig.token_secret as string,
});

export const fetchMoneyList = async (
  startDate: Date,
  endDate: Date,
  mode: MoneyType
) => {
  const responseData = await zaim.getMoney({
    start_date: startDate.toISOString().split("T")[0],
    end_date: endDate.toISOString().split("T")[0],
    mode: mode,
  });
  return JSON.parse(responseData)["money"] as Money[];
};

export const fetchPayments = async (
  startDate: Date,
  endDate: Date,
  paymentType: PaymentType
) => {
  const payments = await fetchMoneyList(startDate, endDate, "payment");
  return payments.filter(
    (payment) => payment.comment.indexOf(paymentType) >= 0
  );
};
