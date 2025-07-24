import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export function authenticate() {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Wallet connection can only be initiated in the browser.'));
      return;
    }
    showConnect({
      appDetails: {
        name: 'STX Stacking Lottery',
        icon: window.location.origin + '/favicon.ico',
      },
      userSession,
      onFinish: () => {
        resolve();
      },
      onCancel: () => {
        reject(new Error('User cancelled connection'));
      },
    });
  });
}

export function getUserData() {
  if (userSession.isUserSignedIn()) {
    return userSession.loadUserData();
  }
  return null;
}

export function signOut() {
  if (typeof window !== 'undefined') {
    userSession.signUserOut(window.location.origin);
  }
} 