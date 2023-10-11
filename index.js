const {
  create,
  refresh,
  refreshWithContent,
  times,
  extend,
  deleteEmail,
} = require("./api");

class MinuteInbox {
  constructor(address, token) {
    this.address = address;
    this.token = token;
  }

  static async build(address, token) {
    if (!address || !token) {
      const accountInfo = await create();
      address = accountInfo[0];
      token = accountInfo[1];
    }
    return new MinuteInbox(address, token);
  }

  getMails() {
    return refresh(this.address, this.token);
  }

  getMailsWithContent() {
    return refreshWithContent(this.address, this.token);
  }

  expires_in() {
    return new Promise((resolve, reject) => {
      times(this.address, this.token)
        .then((data) => {
          let created_at = new Date(data.created_at);
          created_at = created_at.getTime();

          let expires_at = new Date(data.expires_at);

          if (!expires_at) {
            reject(`${this.address} has expired`);
          }

          expires_at = expires_at.getTime();

          resolve(((expires_at - created_at) / 1000).toFixed(0));
        })
        .catch((error) => reject(error));
    });
  }

  extend_10m() {
    return extend(this.address, this.token, 4200);
  }

  extend_1h() {
    return extend(this.address, this.token, 3600);
  }

  extend_1d() {
    return extend(this.address, this.token, 86400);
  }

  extend_1w() {
    return extend(this.address, this.token, 604800);
  }

  extend_1m() {
    return extend(this.address, this.token, 568523);
  }

  delete() {
    return deleteEmail(this.address, this.token);
  }
}

module.exports = MinuteInbox;
