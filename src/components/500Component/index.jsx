import './style.css';
import { Button } from '@mui/material';
import { useEffect } from 'react';

export default function Error500Page() {
  useEffect(() => {
    document.body.style.backgroundColor = 'rgb(255, 236, 236)';
    return () => {
      document.body.style.backgroundColor = '#f3fff6';
    };
  }, []);

  return (
    <div className="Error500">
      <img src="https://i.imgur.com/qIufhof.png" alt="500 Error" />
      <h1>500 Internal server error</h1>
      <p>We are currently trying to fix the problem.🌐Check your network! Reload page!</p>
      <Button onClick={() => window.location.reload()} variant='contained' sx={{mb:4}}>Reload Page ↻</Button>
    </div>
  );
}
