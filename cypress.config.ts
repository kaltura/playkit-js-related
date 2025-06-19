import {defineConfig} from 'cypress';

export default defineConfig({
  experimentalWebKitSupport: true,
  chromeWebSecurity: false,
  defaultCommandTimeout: 30000,
  fileServerFolder: 'cypress/public',
  e2e: {
    supportFile: false,
    watchForFileChanges: false,
    setupNodeEvents(on) {
      on('task', {
        log(message) {
          console.log(message);

          return null;
        }
      });
    }
  }
});
