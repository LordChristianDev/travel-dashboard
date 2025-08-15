import * as Sentry from "@sentry/react-router";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
	dsn: "https://dc99f7de62a09bcbfa825bf131133db7@o4509831642480640.ingest.us.sentry.io/4509831644184576",

	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
	sendDefaultPii: true,

	// Enable logs to be sent to Sentry
	enableLogs: true,

	integrations: [nodeProfilingIntegration()],
	tracesSampleRate: 1.0, // Capture 100% of the transactions
	profilesSampleRate: 1.0, // profile every transaction
});
