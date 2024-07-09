function messageController() {
    const axios = require('axios');
    const API_URL = "https://graph.facebook.com/v20.0/353563817846323/messages";
    const ACCESS_TOKEN = ""
    const sendMessage = async (recipientNumber) => {
        try {
            const response = await axios.post(API_URL, {
                messaging_product: "whatsapp",
                to: recipientNumber,
                type: "template",
                template: {
                    name: "hello_world",
                    language: {
                        code: "en_US"
                    }
                }
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + ACCESS_TOKEN
                }
            });
            console.log('Message sent:', response.data);
        }
        catch (error) {
            console.error('Error sending message:', error.response ? error.response.data : error.message);
        }
    };

}

module.exports = messageController



