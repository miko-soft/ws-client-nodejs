/**
 * Enter one room.
 * Open 031roomEnter.js in one terminal and then run this script in another terminal.
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
  testClient.on('message', msg => {
    console.log('msg::', msg);
  });


  console.log('sending to room "sasa"...');
  await testClient.roomSend('sasa', 'Some message to room sasa.');
};



main().catch(err => console.log(err));
