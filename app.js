import express from 'express';
import exphbs from 'express-handlebars';
import { connectToDb } from './config/mongoConnection.js';
import routes from './routes/index.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { loadCrimeData } from './seed/loadCrimeData.js';
import { seedUsers } from './seed/userSeed.js';

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine
app.engine('handlebars', exphbs.engine({ 
  defaultLayout: 'main', 
  partialsDir: ['views/partials/'],
  helpers: {
    formatDate: function(date) {
      return new Date(date).toLocaleString();
    }
  }
}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(
  session({
    name: "CrimeDB",
    secret: "Hidden admin page!",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1800000 } //maxAge = 30 mins
  })
);

app.use('/admin', (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login');
  } else if (!req.session.user.admin) {
    return res.redirect('/users');
  }

  next();
});

app.use('/login', (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.admin) return res.redirect('/admin');
    return res.redirect('/users');
  }

  next();
});

app.use('/register', (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.admin) return res.redirect('/admin');
    return res.redirect('/home');
  }

  next();
});

app.use('/users', (req, res, next) => {
  if (!req.session.user || !req.session.user.admin) return res.redirect('/home');

  next();
})

app.use('/report', (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');

  next();
})

app.use('/comment', (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');

  next();
})

app.use('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.user = null;
    return res.redirect('/login');
  }

  next();
});

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Register routes
routes(app);

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('error', { message: 'Page not found (404)' });
  next();
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong (500)' });
  next();
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

await loadCrimeData();
await seedUsers();
main();
