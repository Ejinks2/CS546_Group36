import adminRoute from "./adminRoutes.js";

const setRoutes = (app) => {
    app.use('/', adminRoute);

    app.use(/(.*)/, (req, res) => {
        res.status(404).json({ error: "Page not found. "});
    })
}

export default setRoutes;