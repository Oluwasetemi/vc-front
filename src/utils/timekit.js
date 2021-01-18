import timekit from 'timekit-sdk';

timekit.configure({appKey: process.env.TIMEKIT_API_KEY});
export default timekit;
