const MinuteInbox = require("./index");
const { getContent } = require("./api");

const checkEmails = async (inbox) => {
  console.log("Start checking ...");
  // fetch all emails in the inbox
  for (let mail of await inbox.getMails()) {
    console.log("\tFROM:", mail.sender.name, mail.sender.address);
    console.log("\tSUBJECT:", mail.subject);
    console.log("\tSENT AT:", mail.sent_at);
    console.log("\tIS NEW:", mail.is_new);
    console.log();
    if (mail.is_new) await getContent(address, token, mail.id);
  }

  setTimeout(() => {
    checkEmails(inbox);
  }, 3000);
};

const main = async () => {
  // use without parameters to create a new inbox
  const inbox = await MinuteInbox.build();

  // use with address and token to reuse an existing inbox
  // const inbox = new MinuteInbox(
  //   "crockett.cainen@my2ducks.com",
  //   "66a5c5b8d3384454dd88e381fcbfdfc0"
  // );

  address = inbox.address;
  token = inbox.token;

  console.log(address, "(", token, ")");

  // extend the expiration of the inbox by 10 minutes
  inbox.extend_10m();

  console.log("Expires in:", await inbox.expires_in(), "seconds");

  checkEmails(inbox);
};

main();
