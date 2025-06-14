import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';

enum Result {
  Success,
  Error,
  Pending
}

interface OrientationResult {
  result: Result,
  data: string | null;
}

const useQuery = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

const useOrientation : () => OrientationResult = () => {
  const [orientation, setOrientation] = useState({result: Result.Pending, data: null});

  useEffect(() => {
    if ((DeviceOrientationEvent as any).requestPermission) {
      (DeviceOrientationEvent as any).requestPermission()
        .then((response : string) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", (ev) => {
              const e = ev as any;
              const heading = e.webkitCompassHeading || Math.abs(e.alpha - 360);
              setOrientation({result: Result.Success, data: heading});
            }, true);
          } else {
            setOrientation({result: Result.Error, data: null});
          }
        });
      }
    }, []); // No deps

  return orientation;
};

const App = () => {
  const query = useQuery();

  const orientation = useOrientation();

  useEffect(() => {
    console.log(orientation);
  }, [orientation]);
  
  return (
      <div className="App">
        <p>{orientation.result}</p>
        <p>{orientation.data}</p>
        <p>{query.get("name")}</p>
      </div>
  );
}

export default App;
