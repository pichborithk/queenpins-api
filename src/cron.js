require('dotenv').config();

const cron = require('cron');
const http = require('http');

const URL = process.env.API_URL + '/ping';

const job = new cron.CronJob('*/1 * * * *', () => {
  console.log('Make request to', URL);
  console.log('Restarting server');

  http
    .get(URL, res => {
      //   if (res.statusCode === 200) {
      //     console.log('Server restarted');
      //   } else {
      //     console.error(
      //       `failed to restart server with status code: ${res.statusCode}`
      //     );
      //   }
      let data;
      res
        .on('data', chunk => {
          data = chunk;
        })
        .on('end', () => {
          console.log(
            'Success request to server with status code:',
            res.statusCode
          );
          console.log('Server restarted');
          console.log(JSON.parse(data).message);
        });
    })
    .on('error', error => {
      console.error('Error during Restart:', error.message);
    });
});

module.exports = { job };
