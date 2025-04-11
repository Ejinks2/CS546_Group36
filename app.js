import express from 'express';
import exphbs from 'express-handlebars';
import { connectToDb } from './config/mongoConnection.js';
import routes from './routes/index.js';

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Register routes
routes(app);

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('error', { message: 'Page not found (404)' });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong (500)' });
});

// Start server after DB connects
const main = async () => {
  try {
    await connectToDb();
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (e) {
    console.error('Failed to connect to the database or start server:', e);
  }
};

main();
