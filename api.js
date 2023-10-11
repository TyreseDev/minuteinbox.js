const axios = require("axios");
const crypto = require("crypto");

const get = async (service, token, address) => {
  let cookie = "";
  if (!address) {
    cookie = `PHPSESSID=${token}`;
  } else {
    cookie = `PHPSESSID=${token}; MI=${address}; wpcc=dismiss`;
  }
  const headers = {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Connection: "close",
    Cookie: cookie,
  };
  try {
    const response = await axios.get(`https://www.minuteinbox.com/${service}`, {
      maxRedirects: 5,
      headers,
    });
    return response;
  } catch (error) {
    await Logger(`${error.name}: ${error.message}`);
  }
};

const create = async () => {
  const token = crypto.randomBytes(16).toString("hex");
  const response = await get("index/index", token);
  return [response?.data?.email, token];
};

const getContent = async (address, token, id) => {
  const response = await get(`email/id/${id}`, token, address);
  return response.data;
};

const refresh = async (address, token) => {
  const response = await get("index/refresh", token, address);

  const mails = await Promise.all(
    response?.data?.map(async (mail) => {
      const [sender_name, sender_address] = mail.od.split(" <");
      return {
        id: mail.id,
        sent_at: mail.kdy,
        is_new: mail.precteno === "new",
        sender: {
          name: sender_name,
          address: sender_address ? sender_address.slice(0, -1) : sender_name,
        },
        subject: mail.predmet,
      };
    })
  );

  return mails;
};

const refreshWithContent = async (address, token) => {
  const response = await get("index/refresh", token, address);

  const mails = await Promise.all(
    response?.data?.map(async (mail) => {
      const [sender_name, sender_address] = mail.od.split(" <");
      return {
        id: mail.id,
        sent_at: mail.kdy,
        is_new: mail.precteno === "new",
        sender: {
          name: sender_name,
          address: sender_address ? sender_address.slice(0, -1) : sender_name,
        },
        subject: mail.predmet,
        content: await getContent(address, token, mail.id),
      };
    })
  );

  return mails;
};

const times = async (address, token) => {
  const response = await get("index/zivot", token, address);
  return {
    created_at: response.data.ted,
    expires_at: response.data.konec,
  };
};

const extend = async (address, token, seconds) => {
  return await get(`expirace/${seconds}`, token, address);
};

const deleteEmail = async (address, token) => {
  const response = await get("delete", token, address);
  return response;
};

module.exports = {
  get,
  create,
  getContent,
  refresh,
  refreshWithContent,
  times,
  extend,
  deleteEmail,
};
