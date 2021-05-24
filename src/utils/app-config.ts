import axios from 'axios';

async function initAppConfig(): Promise<any> {
  const config = await import('../../app.config.json');
  const appConfig = 'app.config.json';

  return new Promise((resolve, reject) => {
    try {
      if (process.env.NODE_ENV === 'production') {
        axios
          .get(`${process.env.APP_PROJECT_PATH || ''}/conf/${appConfig}`)
          .then((response) => {
            resolve(response.data);
          });
      } else {
        resolve(config);
      }
    } catch (e) {
      reject(e);
    }
  });
}

export default initAppConfig;