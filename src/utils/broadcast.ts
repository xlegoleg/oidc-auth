import { get, isEmpty, isEqual, isObject } from 'lodash';
import { Auth } from '@services/AuthService';

// use local storage for messaging. Set message in local storage and clear it right away
// This is a safe way how to communicate with other tabs while not leaving any traces
//
export function messageBroadcast(message: any) {
  localStorage.setItem('microws', JSON.stringify(message));

  localStorage.removeItem('microws');
}

// receive message
//
export function messageReceive(e: any) {
  const key = get(e, 'key');

  if (!isEqual(key, 'microws')) {
    return; // ignore other keys
  }

  const message = JSON.parse(get(e, 'newValue'));

  if (isEmpty(message)) {
    return; // ignore empty msg or msg reset
  }

  if (isObject(message)) {
    for (const [key] of Object.entries(message)) {
      const action = get(message, `${key}.action`);

      if (action) {
        switch (action) {
          case 'relogin': {
            setTimeout(() => {
              Auth.logout().then(() => {
                Auth.setUser(null);
              });
            }, 1000); // вкладка-инициатор выхода должна быть первой, поэтому тут задержка

            break;
          }
        }
      }
    }
  }
}
