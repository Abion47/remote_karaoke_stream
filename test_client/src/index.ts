import ws from 'ws';
import * as uuid from 'uuid';

export type User = {
  id: string;
  name: string;
}

export type Packet = {
  event: string;
  data: any;
}

const id = uuid.v4();
const name = 'Testificate #A'

const client = new ws.WebSocket('ws://localhost:9000', {
  headers: { 
    'User-Identity-ID': id,
    'User-Identity-Name': name,
  }
});

client.on('open', () => {
  console.log('connected');
})

client.on('message', (rawData) => {
  const { event, data } = JSON.parse(rawData.toString('utf8')) as Packet;

  console.log(event, data);
})

client.on('close', () => {
  console.log('close');
})

client.on('error', () => {
  console.log('error');
})