const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '352377907218-d1ctco2o50a10v45hdeh5v6rakdfs0fb.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04AHjwghZSZAYCgYIARAAGAQSNwF-L9IrdSbWBhLiXBmKn84LfD7rWjqzHE8OArQ_cYniSLf4qzCGPNh7wf8HOmWM3XZJ7ejsrf8';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail() {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'paul@martlet-express.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'YOUR NAME <your-email@gmail.com>',
      to: 'vinokurovartyom@gmail.com',
      subject: 'Test Email',
      text: 'Hello from Node.js',
      html: '<h1>Hello from Node.js</h1>',
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

sendMail()
  .then((result) => console.log('Email sent...', result))
  .catch((error) => console.log(error.message));