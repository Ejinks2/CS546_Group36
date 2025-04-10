import express from 'express';
import exphbs from 'express-handlebars';
import routes from "./routes/index.js";

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs.engine({defaultLayout : "main"}));
app.set('view engine', 'handlebars');

routes(app);
app.listen(3000, () => {
    console.log("Your server is running on http://localhost:3000");
})