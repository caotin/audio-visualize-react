import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [audio, setAudio] = useState(null)
  const [audioData, setAudioData] = useState(null)
  const [analyser, setAnalyser] = useState(null)
  const [dataArray, setDataArray] = useState(null)
  const [rafId, setRafId] = useState(null)

  useEffect(() => {
    const getMicrophone = async () => {
      const audio = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
      setAudio(audio)
    }
    getMicrophone()
  }, [])

  useEffect(() => {

    if (audio) {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      setDataArray(new Uint8Array(analyser.frequencyBinCount))
      const source = audioContext.createMediaStreamSource(audio);
      source.connect(analyser);
      setRafId(requestAnimationFrame(tick))
      setAnalyser(analyser)
    }
    return () => {
      // cancelAnimationFrame(rafId);
      // analyser.disconnect();
      // source.disconnect();
    }
  }, [audio])

  const tick = () => {
    analyser.getByteTimeDomainData(dataArray)
    setAudioData(dataArray)
    setRafId(requestAnimationFrame(tick))
  }

  const count = audioData && Math.max(...audioData)
  return (
    <div className="App">
      <div className='audio-container'>
        <div className='audio-box' style={{
          border: 'solid',
          borderWidth:  count / 15,
          borderColor: 'pink'
        }}></div>
      </div>
    </div>
  );
}

export default App;
