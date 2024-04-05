// eslint-disable-next-line @typescript-eslint/no-var-requires
if (process.env.NODE_ENV === 'production') { // only use module-alias in production
  require('module-alias/register');
}
require('dotenv').config();
import app from './app';

/*
 *  decouple the app and the running server
 *  , so your tests can import the
 *  app without starting the server
 */
const PORT = process.env.PORT ?? 9000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
