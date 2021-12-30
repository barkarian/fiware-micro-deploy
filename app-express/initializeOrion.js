const fetch = require("node-fetch");
const {
  getSubscriptions,
  createSubscription,
} = require("./subscriptions/subscription.repo");

module.exports = async () => {
  //1.GET subscriptions
  const subscriptions = await getSubscriptions();
  if (subscriptions.length > 0) {
    console.log({ msg: "Orion has already been initialized" });
    return;
  }
  //2.Or CREATE subscriptions
  triggerAttrs = ["startTickets", "stopTickets", "soldOut"];
  await createSubscription(triggerAttrs, "changes");
  console.log({ msg: "Orion have just been successfully initialized" });
};
