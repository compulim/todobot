import 'dotenv/config';

import { BotFrameworkAdapter } from 'botbuilder';
import { MicrosoftAppCredentials } from 'botframework-connector';
import { join } from 'path';
import fetch from 'node-fetch';
import prettyMs from 'pretty-ms';
import restify from 'restify';
import serveHandler from 'serve-handler';

import Bot from './bot';
import generateDirectLineToken from './generateDirectLineToken';
import renewDirectLineToken from './renewDirectLineToken';

const {
  DIRECT_LINE_SECRET,
  MICROSOFT_APP_ID,
  MICROSOFT_APP_PASSWORD,
  PORT,
  SPEECH_SERVICES_REGION,
  SPEECH_SERVICES_SUBSCRIPTION_KEY
} = process.env;

// Create server
const server = restify.createServer();
const bot = new Bot();

server.listen(PORT, () => {
  console.log(`${ server.name } listening to ${ server.url }`);
});

server.use(restify.plugins.queryParser());

MicrosoftAppCredentials.trustServiceUrl('https://api.scratch.botframework.com');
MicrosoftAppCredentials.trustServiceUrl('https://state.scratch.botframework.com');
MicrosoftAppCredentials.trustServiceUrl('https://token.scratch.botframework.com');

MicrosoftAppCredentials.trustServiceUrl('https://api.ppe.botframework.com');
MicrosoftAppCredentials.trustServiceUrl('https://state.ppe.botframework.com');
MicrosoftAppCredentials.trustServiceUrl('https://token.ppe.botframework.com');

// Create adapter
const adapter = new BotFrameworkAdapter({
  appId: MICROSOFT_APP_ID,
  appPassword: MICROSOFT_APP_PASSWORD
});

let numActivities = 0;
const up = Date.now();

server.get('/ready.txt', async (_, res) => {
  const message = `TodoBot v4 is up since ${ prettyMs(Date.now() - up) } ago, processed ${ numActivities } activities.`;
  const separator = new Array(message.length).fill('-').join('');

  res.set('Content-Type', 'text/plain');
  res.send(JSON.stringify({
    human: [
      separator,
      message,
      separator
    ],
    computer: {
      numActivities,
      up
    }
  }, null, 2));
});

server.get('/health.txt', async (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('OK');
});

function trustedOrigin(origin) {
  return (
    /^https?:\/\/localhost([\/:]|$)/.test(origin)

    // This is for Docker tests
    || /^https?:\/\/webchat([\/:]|$)/.test(origin)

    || /^https?:\/\/[\d\w]+\.ngrok\.io(\/|$)/.test(origin)
    || /^https?:\/\/([\d\w]+\.)+botframework\.com(\/|$)/.test(origin)
    || /^https:\/\/compulim\.github\.io(\/|$)/.test(origin)
    || /^https:\/\/microsoft\.github\.io(\/|$)/.test(origin)

    // This is CodePen
    || /^https:\/\/cdpn\.io(\/|$)/.test(origin)
    || /^https:\/\/s\.codepen\.io(\/|$)/.test(origin)
  );
}

server.post('/api/directline/token', async (req, res) => {
  const origin = req.header('origin');

  if (!trustedOrigin(origin)) {
    return res.send(403, 'not trusted origin');
  }

  const { token } = req.query;

  try {
    if (token) {
      res.send(await renewDirectLineToken(token), { 'Access-Control-Allow-Origin': '*' });
    } else {
      res.send(await generateDirectLineToken(), { 'Access-Control-Allow-Origin': '*' });
    }
  } catch (err) {
    res.send(500, err.message, { 'Access-Control-Allow-Origin': '*' });
  }

  if (token) {
    console.log(`Refreshing Direct Line token for ${ origin }`);
  } else {
    console.log(`Requesting Direct Line token for ${ origin } using secret "${ DIRECT_LINE_SECRET.substr(0, 3) }...${ DIRECT_LINE_SECRET.substr(-3) }"`);
  }
});

server.post('/api/speechservices/token', async (req, res) => {
  const origin = req.header('origin');

  if (!trustedOrigin(origin)) {
    return res.send(403, 'not trusted origin');
  }

  console.log(`Requesting speech token for ${ origin }`);

  const cres = await fetch(`https://${ SPEECH_SERVICES_REGION }.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
    headers: { 'Ocp-Apim-Subscription-Key': SPEECH_SERVICES_SUBSCRIPTION_KEY },
    method: 'POST'
  });

  if (cres.status === 200) {
    res.send({
      region: SPEECH_SERVICES_REGION,
      token: await cres.text()
    }, {
      'Access-Control-Allow-Origin': '*'
    });
  } else {
    res.send(500, {
      'Access-Control-Allow-Origin': '*'
    });
  }
});

// Listen for incoming requests
server.post('/api/messages', (req, res) => {
  adapter.processActivity(req, res, async context => {
    numActivities++;
    await bot.run(context);
  });
});

server.get('/**/*', async (req, res) => {
  await serveHandler(req, res, {
    public: join(__dirname, '../public')
  });
});
