import React, { useState, useEffect } from 'react';

function Home() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/time')
      .then((res) => res.json())
      .then((data) => {
        setCurrentTime(data.time);
      });
  }, []);

  return (
    <div>
      <h1>
        <p>The current time is {currentTime}.</p>
      </h1>
    </div>
  );
}

export default Home;
