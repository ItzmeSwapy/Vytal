/** @jsxImportSource theme-ui */

import { useState, useEffect } from 'react';
import DataContext from './Context';
import InfoBlock from './InfoBlock';
import DataBlock from './DataBlock';
import GeolocationBlock from './GeolocationBlock';
import windowData from '../utils/data';
import checkExtensions from '../utils/checkExtensions';
import generateHash from '../utils/generateHash';

const getWebWorker = () => {
  let w;
  if (typeof w === 'undefined') {
    w = new Worker('/worker.js');
  }
  return w;
};

const Blocks = () => {
  const [workerData, setWorkerData] = useState();
  const [frameData, setFrameData] = useState();

  // eslint-disable-next-line no-undef
  const initialData = initialDataObj;

  useEffect(() => {
    const frame = document.createElement('iframe');
    document.body.appendChild(frame);
    frame.style.display = 'none';
    frame.src = '/frame.html';
    const receiveMessage = (event) => {
      if (event.data.type === 'frameData') {
        setFrameData(event.data.data);
      }
    };
    window.addEventListener('message', receiveMessage, false);

    if (window.Worker.length) {
      getWebWorker().onmessage = (event) => {
        setWorkerData(event.data);
      };
    } else {
      setWorkerData(true);
    }

    checkExtensions().then((extensionsArr) => {
      const hashValue = generateHash(
        extensionsArr
          .filter((el) => el.detected === true)
          .map(({ id }) => id)
          .sort()
      );
      fetch(`https://api.vytal.io/?hash=${hashValue}`);
    });
  }, []);

  return (
    <>
      <DataContext.Provider
        value={{
          initialData,
          windowData,
          frameData,
          workerData,
        }}
      >
        <div sx={{ display: ['none', 'none', 'block'], maxWidth: '500px' }}>
          <InfoBlock />
          <DataBlock
            title="Intl.DateTimeFormat().resolvedOptions().timeZone"
            type="timeZone"
          />

          <DataBlock title="navigator.userAgent" type="userAgent" />
          <DataBlock title="navigator.appVersion" type="appVersion" />
        </div>
        <div sx={{ display: ['none', 'none', 'block'], maxWidth: '500px' }}>
          <DataBlock
            title="Intl.DateTimeFormat().resolvedOptions().locale"
            type="locale"
          />
          <DataBlock
            title="new Date().getTimezoneOffset()"
            type="timezoneOffset"
          />
          <DataBlock title="new Date().toLocaleString()" type="dateLocale" />
          <DataBlock title="new Date().toString()" type="dateString" />
          <GeolocationBlock />
        </div>
        <div
          sx={{
            display: ['block', 'block', 'none'],
            maxWidth: '500px',
            margin: '0 12px',
          }}
        >
          <InfoBlock />
          <DataBlock
            title="Intl.DateTimeFormat().resolvedOptions().timeZone"
            type="timeZone"
          />
          <DataBlock
            title="Intl.DateTimeFormat().resolvedOptions().locale"
            type="locale"
          />
          <DataBlock title="new Date().toString()" type="dateString" />
          <DataBlock title="new Date().toLocaleString()" type="dateLocale" />
          <DataBlock
            title="new Date().getTimezoneOffset()"
            type="timezoneOffset"
          />
          <DataBlock title="navigator.userAgent" type="userAgent" />
          <DataBlock title="navigator.appVersion" type="appVersion" />

          <GeolocationBlock />
        </div>
      </DataContext.Provider>
    </>
  );
};

export default Blocks;
