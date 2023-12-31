/**
 * The example shows how to implement regoch-router on the client side.
 * This script sends the message to the server and server responds with the route command which is used in regoch-router.
 */
const { WsClientNodejs, lib } = require('../index.js');

const Router = require('@mikosoft/router');
const router = new Router({ debug: false });


class TestClient extends WsClientNodejs {
  constructor(wcOpts) {
    super(wcOpts);
  }
}


const main = async () => {
  // connect to websocket server
  const wcOpts = {
    connectTimeout: 8000,
    reconnectAttempts: 6, // try to reconnect n times
    reconnectDelay: 5000, // delay between reconnections
    questionTimeout: 13000, // wait for answer
    subprotocols: ['jsonRWS', 'raw'],
    autodelayFactor: 500,
    debug: false,
    debug_DataParser: false
  };
  const testClient = new TestClient(wcOpts);
  await testClient.connect('ws://localhost:3211?authkey=TRTmrt');

  // IMPORTANT!!! Set the message listener before the question is sent.
  testClient.once('route', (msg, msgSTR, msgBUF) => {
    console.log('route msg received::', msg);

    const payload = msg.payload; // {uri:string, body?:any}

    // router transitional varaible
    router.trx = {
      uri: payload.uri,
      body: payload.body,
      client: testClient
    };

    // route definitions
    router.def('/returned/back/:n', (trx) => { console.log('trx.params::', trx.params); });
    router.notfound((trx) => { console.log(`The URI not found: ${trx.uri}`); });

    // execute the router
    router.exe().catch(err => {
      console.log(err);
    });
  });


  console.log('sending /send/me/back route...');
  await lib.helper.sleep(400);
  await testClient.route('/send/me/back');

};



main().catch(err => console.log(err));
