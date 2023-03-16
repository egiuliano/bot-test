const request = require('request');
const notifier = require('node-notifier');
const moment = require('moment');
const cheerio = require('cheerio');
const NodeMailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const URL = 'https://www.deportick.com/';

const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

let transport = NodeMailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD
  }
});

const mailOptions = {
  from: 'Bot entradas AFA',
  to: 'ACÁ VA EL EMAIL DESTINATARIO', // Reemplazar por el mail al que querés que le llegue el aviso
  subject: 'Se publicaron las entradas',
  text: 'A comprar https://www.deportick.com/'
};



function checkForUpdates() {
  request(URL, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      // console.log(html);
      const eventoArgentina = $('div.event-thumb a').first();
      // console.log(eventoArgentina)
      const link = eventoArgentina.attr('href');
      if (link) {
        notifier.notify({
          title: 'ENTRADAS AFA',
          message: 'Se publicaron las entradas para ver al campeón',
          icon: './assets/messirve.jpg',
          appID: 'Bot entradas AFA'
        });
        transport.sendMail(mailOptions, function(err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log(info);
          }
        });
        console.log(`\nHora: ${moment().format('YYYY-MM-DD HH:mm:ss')} | Se publicaron las entradas!\n`);
        console.log(link);
        clearInterval(intervalId);
      } else {
        console.log(`\nHora: ${moment().format('YYYY-MM-DD HH:mm:ss')} | Aún no se publicaron las entradas :(\n`);
      }
    }
  });
}

const intervalId = setInterval(checkForUpdates, 30000);