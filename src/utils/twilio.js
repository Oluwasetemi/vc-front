const accountSid = process.env.TWILIO_TEST_ACCOUNT_SID;
const authToken = process.env.TWILIO_TEST_AUTH_TOKEN;
import client from 'twilio';

export default client(accountSid, authToken);
