/**
 * The message listener.
 */
const { WsClientNodejs } = require('../index.js');


class TestClient extends WsClientNodejs {
  constructor(wcOpts) {
    super(wcOpts);
  }
}



const main = async () => {
  // connect to websocket server
  const wcOpts = {
    questionTimeout: 3 * 1000,
    reconnectAttempts: 5, // try to reconnect 5 times
    reconnectDelay: 3000, // delay between reconnections is 3 seconds
    subprotocols: ['jsonRWS', 'raw'],
    debug: false,
    debug_DataParser: false
  };
  const testClient = new TestClient(wcOpts);
  const socket = await testClient.connect('ws://localhost:3211?authkey=TRTmrt');

  console.log('Listenning for messages from the server...');

  // 1) This is the best way because it will catch messages after reconnection
  let i = 1;
  testClient.on('message', (msg, msgSTR, msgBUF) => {
    console.log(`${i}. received::`, msgSTR);
    if (i % 10 === 0) { console.log(''); }
    i++;
  });

};



main().catch(err => console.log(err));
