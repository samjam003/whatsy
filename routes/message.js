const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_URL = "https://graph.facebook.com/v20.0/353563817846323/messages";
const ACCESS_TOKEN = "EAAGWP2LOqGMBO54mUZCOsluNxpuvZAdaSX4oz0JcNX2sXhqFujDMJZBDMG3JFjvFeZCwOBVErP9WFjA3MtcZBXQRJGFTOnCJ9d9C5FX6GKvKePM1qYWZAA2KkaHpMpGEfxfnzJ4Pw7BHrO0OgVshSZCe7W611qCCRjYOEXrMarcjZAQYOkZA4w7XCZBlsjZBFEL8a8DeavblHCl59Pfij7DUVJmgIOyLj9P";  // Replace with your actual access token

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

module.exports = router;
