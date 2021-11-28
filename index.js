const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/dataBaseConnection");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

//init Sentry
Sentry.init({
  dsn: "https://cafa2fa67934474b8315235a6b184cbe@o1078963.ingest.sentry.io/6083493",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

//apply middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(cors());
app.use(express.json({ extended: false }));
app.use(
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//connection to mongoDB
connectDB();

//resolve static folder for react app
app.use(express.static("front-hack/build"));

//routes
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));

//sentry error handler
app.use(Sentry.Handlers.errorHandler());

if (process.env.NODE_ENV === "production")
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "front-app", "build", "index.html"));
  });

//initial port to start
const PORT = process.env.PORT || 5000;

//server app
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

//for mocha testing
module.exports = app;
