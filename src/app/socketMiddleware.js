import io from 'socket.io-client';
import { setAccounts } from '../redux/accountSlice';

const socket = io('wss://echo.websocket.org');



const socketMiddleware = () => {
  return (storeAPI) => {
    socket.on('connect', () => {
        
      console.log('Connected to WebSocket server');
    });

    socket.on('event_from_server', (data) => {
      console.log('Received data from server:', data);
    });

    socket.on('disconnect', (data) => {
      console.log('Disconnected from WebSocket server');
      storeAPI.dispatch(setAccounts({ data }));
    });

    return (next) => (action) => {
      // Xử lý action ở đây (nếu cần thiết)

      return next(action);
    };
  };
};

export default socketMiddleware;
