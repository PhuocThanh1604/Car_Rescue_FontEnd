import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TIMEOUT = 30 * 60 * 1000; 
export default function AutoLogout() {
  const navigate = useNavigate();
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    
    const resetTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const id = setTimeout(() => {
        // Điều hướng đến trang logout khi hết thời gian timeout
        navigate("/signin");
        setTimeout(() => {
          window.location.reload(); // Auto reload sau khi logout
        }); // Thời gian chờ trước khi reload (1000 milliseconds = 1 giây)
      }, TIMEOUT);


      setTimeoutId(id);
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

    const onEvent = () => {
      resetTimeout();
    };

    for (const event of events) {
      window.addEventListener(event, onEvent);
    }

    resetTimeout(); // Reset timeout ban đầu

    return () => {
      for (const event of events) {
        window.removeEventListener(event, onEvent);
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId, navigate]);

  return null;
}
