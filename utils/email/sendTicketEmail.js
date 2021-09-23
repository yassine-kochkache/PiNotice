const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const sendEmail = (email, subject, payload, template, ticket) => {
    return new Promise(async (resolve, reject) => {
        try {
            // create reusable transporter object using the default SMTP transport
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.MAIL,
                    pass: process.env.PASSWORD
                },

            });

            const source = fs.readFileSync(path.join(__dirname, template), "utf8");
            const compiledTemplate = handlebars.compile(source);
            const options = () => {
                return {
                    from: process.env.MAIL,
                    to: email,
                    subject: subject,
                    html: compiledTemplate(payload),
                    attachments: [
                        { filename: 'ticket.png', content: fs.createReadStream(ticket) }
                    ]
                };
            };

            // Send email
            const info = await transporter.sendMail(options())
            resolve(info)
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })

};

module.exports = sendEmail;
