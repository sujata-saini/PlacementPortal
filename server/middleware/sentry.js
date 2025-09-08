Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0 });

// Before routes
app.use(Sentry.requestHandler());

// After routes
app.use(Sentry.errorHandler());
