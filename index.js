const { google } = require('googleapis');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

const CLIENT_ID = '352377907218-d1ctco2o50a10v45hdeh5v6rakdfs0fb.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04AHjwghZSZAYCgYIARAAGAQSNwF-L9IrdSbWBhLiXBmKn84LfD7rWjqzHE8OArQ_cYniSLf4qzCGPNh7wf8HOmWM3XZJ7ejsrf8';

const CLIENT_ID_2 = '352377907218-d1ctco2o50a10v45hdeh5v6rakdfs0fb.apps.googleusercontent.com';
const CLIENT_SECRET_2 = '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';
const REDIRECT_URI_2 = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN_2 = '1//04fpNzRnUqr_LCgYIARAAGAQSNwF-L9Ir8Dlf19R_Ht9d7-FpApeV6JHKJAtDOssdEFVQcVboRGPp9LCEk0uc2Yromcfr55zvD9c';

async function sendMail(from, to, subject, text) {
  let oAuth2Client, transportOptions;

  if (from === 'paul@martlet-express.com') {
    oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    transportOptions = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'paul@martlet-express.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: (await oAuth2Client.getAccessToken()).token,
      },
    };
  } else {
    oAuth2Client = new google.auth.OAuth2(CLIENT_ID_2, CLIENT_SECRET_2, REDIRECT_URI_2);
    oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN_2 });
    transportOptions = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: from,  // Change this to from
        clientId: CLIENT_ID_2,
        clientSecret: CLIENT_SECRET_2,
        refreshToken: REFRESH_TOKEN_2,
        accessToken: (await oAuth2Client.getAccessToken()).token,
      },
    };
  }

  try {
    const transport = nodemailer.createTransport(transportOptions);

    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: text,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw error;
  }
}

app.use(bodyParser.json());
app.use(cors());

app.post('/send-email', async (req, res) => {
  const { from, to, subject, text } = req.body;

  try {
    const result = await sendMail(from, to, subject, text);
    console.log('Email sent...', result);
    res.status(200).send({ message: 'Email sent successfully', result });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: 'Failed to send email', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});