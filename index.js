const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const passwords = {
    mail1 : '123',
    mail2 : '213'
}

app.post('/send-email', async (req, res) => {
    const { from, to, subject, text } = req.body;
    
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: from || 'yauheni.test123@gmail.com',
            //pass: passwords[from], 
            pass: 'mpupjljhfikonpvt'
        },
    });

    let mailOptions = {
        from: from || 'yauheni.test123@gmail.com',
        to: to, 
        subject: subject, 
        text: text,
        headers: {
        'List-Unsubscribe': '<mailto:unsubscribe@example.com?subject=unsubscribe>', // Unsubscribe header
    }
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);

        res.status(200).send({ message: 'Email sent successfully!', messageId: info.messageId });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ error: 'Failed to send email' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
