const mailgun = require("mailgun-js");
const DOMAIN = "sandboxa290eb457da745fdad8b11f801694050.mailgun.org";
const api_key = "key-a2e59f19d680870987eef72e0a6e2ec3";
const mg = mailgun({
  apiKey: api_key,
  domain: DOMAIN,
});
// const path = require("path")

const sendMail = async (props) => {
    // const filepath = 
    console.log(props)
    const {title, body} = props
    const data = {
      //   from: `VidConPortal <${props.senderEmail}>`,
      from: `VidConPortal <mailgun@sandboxa290eb457da745fdad8b11f801694050.mailgun.org>`,
      to: ["mastervoon.s@gmail.com", "zeft.huisen@gmail.com"],
      subject: `${title}`,
      text: `${body}`,
      //   attachment: filepath
    };
    mg.messages().send(data, function (error, body) {
      console.log(body);
      console.log(error)
    });
}

module.exports = sendMail;