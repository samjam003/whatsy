const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_URL = "https://graph.facebook.com/v20.0/353563817846323/messages";
const ACCESS_TOKEN ="EAAGWP2LOqGMBO54mUZCOsluNxpuvZAdaSX4oz0JcNX2sXhqFujDMJZBDMG3JFjvFeZCwOBVErP9WFjA3MtcZBXQRJGFTOnCJ9d9C5FX6GKvKePM1qYWZAA2KkaHpMpGEfxfnzJ4Pw7BHrO0OgVshSZCe7W611qCCRjYOEXrMarcjZAQYOkZA4w7XCZBlsjZBFEL8a8DeavblHCl59Pfij7DUVJmgIOyLj9P";  // Replace with your actual access token
const VERIFY_TOKEN = "saim1234";  // Replace with your webhook verify token

const sendMessage = async (recipientNumbers, template) => {
    const requests = recipientNumbers.map(async (recipientNumber) => {
        try {
            const response = await axios.post(API_URL, {
                messaging_product: "whatsapp",
                to: recipientNumber,
                type: "template",
                template: {
                    name: template,
                    language: {
                        code: "en_US"
                    }
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Message sent to', recipientNumber, ':', response.data);
        } catch (error) {
            console.error('Error sending message to', recipientNumber, ':', error.response ? error.response.data : error.message);
        }
    });

    // Wait for all requests to complete
    await Promise.all(requests);
};

// Middleware to parse JSON and URL-encoded form data
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', (req, res) => {
    res.render('message', { title: 'Message' });
});

router.post('/', async (req, res) => {
    const { template, phone } = req.body;
    const recipientNumbers = phone.split(',').map(num => num.trim());  // Split and trim phone numbers

    console.log('Template:', template);
    console.log('Phone numbers:', recipientNumbers);

    await sendMessage(recipientNumbers, template);
    res.render('message', { title: 'Message', template, phone: recipientNumbers.join(', ') });
});

// Webhook verification endpoint
router.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Webhook to receive messages
router.post('/webhook', (req, res) => {
    const body = req.body;

    console.log('Incoming webhook message:', JSON.stringify(body, null, 2));

    if (body.object === 'whatsapp_business_account') {
        body.entry.forEach(entry => {
            const changes = entry.changes;

            changes.forEach(change => {
                if (change.field === 'messages') {
                    const message = change.value.messages[0];
                    console.log('Received message:', message);

                    // Process the incoming message here
                    // You can implement your logic to handle the message
                }
            });
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

module.exports = router;
