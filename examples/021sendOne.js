/**
 * Send to one client: $ node 021sendOne.js 210727090438377820
 * Open client for listening messages in the another terminal with $ node 010onMessage.js
 */
const { WsClientNodejs, lib } = require('../index.js');


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

  const to = process.argv[2];
  await testClient.sendOne(to, 'A');

  console.log('message sent');
  await lib.helper.sleep(2000);
  process.exit();
};



main().catch(err => console.log(err));
