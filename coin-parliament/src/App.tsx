import React, { useState, useEffect} from 'react';
import CardShow from './Components/Pairs/CardShow';


const App = () => {

  const [socketConnect, setSocketConnect] = useState<any>(false);
  const storedCoinsPrice = localStorage.getItem('CoinsPrice');
  const getCoinPrice = storedCoinsPrice ? JSON.parse(storedCoinsPrice) : {};
  const [localPrice, setLocalPrice] = useState<any>(getCoinPrice);
  const [coins, setCoins] = useState()
  const [message, setMessage] = useState("");
  const [ws, setWs] = useState(null);


  const connect =()=>{
    const socket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    socket.onopen = () => {
      setSocketConnect(true)
    };   

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log("Received message:", data);
      setCoins(data?.p)
          };
    
    socket.onclose = (event: any) => {
     
      setSocketConnect(false);
      // console.log('WebSocket connection closed', event);
      if (event.code !== 1000) {
        // console.log('WebSocket Attempting to reconnect in 5 seconds...');
        setTimeout(() => {
          connect();
        }, 5000);
      }
    };
  }

  useEffect(() => {
    connect()
  }, []);

    return (
    <div>
      <CardShow coins={coins} />
    </div>
  );
};

export default App;


