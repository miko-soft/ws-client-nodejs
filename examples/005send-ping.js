/**
 * Ping example. On server side must be wsOpts.debug: true
 * Client is sending ping (opcode 0x9) and the server is responding with pong (opcode 0xA).
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

  console.log('Send 5 pings every 1 second and receive pongs...');
  await lib.helper.sleep(2000);

  testClient.on('pong', msgSTR => {
    console.log('received::', msgSTR);
  });

  // IMPORTANT: Use ping() method after on('pong', cb) listener
  await testClient.ping(1000, 5); // send ping 5 times, every 1 second
};

main();



