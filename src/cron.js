require('dotenv').config();

const cron = require('cron');
const http = require('http');

const URL = process.env.API_URL + '/ping';

const job = new cron.CronJob('*/1 * * * *', () => {
  console.log('Restarting server');

  http
    .get(URL, res => {
      if (res.statusCode === 200) {
        console.log('Server restarted');
      } else {
        console.error(
          `failed to restart server with status code: ${res.statusCode}`
        );
      }
    })
    .on('error', error => {
      console.error('Error during Restart: ', error.message);
    });
});

module.exports = { job };
