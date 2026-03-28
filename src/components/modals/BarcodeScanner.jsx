import { useState, useRef, useEffect } from 'react'
import styles from './BarcodeScanner.module.css'

export default function BarcodeScanner({ onResult }) {
  const [manual, setManual] = useState('')
  const [scanning, setScanning] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setScanning(true)
    } catch {
      alert('Camera not available or permission denied. Use manual entry below.')
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    setScanning(false)
  }

  useEffect(() => () => streamRef.current?.getTracks().forEach(t => t.stop()), [])

  return (
    <div className={styles.scanner}>
      <p className={styles.hint}>
        Open your camera to scan a barcode, or type / paste the serial number manually.
      </p>

      {!scanning ? (
        <button className={styles.cameraBtn} onClick={startCamera}>
          📷 Open Camera
        </button>
      ) : (
        <div className={styles.videoWrap}>
          <video ref={videoRef} autoPlay playsInline className={styles.video} />
          <p className={styles.videoHint}>Point camera at barcode</p>
          <button className={styles.stopBtn} onClick={stopCamera}>Stop Camera</button>
        </div>
      )}

      <div className={styles.manualBox}>
        <p className={styles.manualLabel}>Manual Entry / Paste from USB Scanner</p>
        <div className={styles.manualRow}>
          <input
            autoFocus
            className={styles.manualInput}
            value={manual}
            onChange={e => setManual(e.target.value)}
            placeholder="Type or scan serial number…"
            onKeyDown={e => e.key === 'Enter' && manual && onResult(manual)}
          />
          <button
            className={styles.useBtn}
            onClick={() => manual && onResult(manual)}
          >
            Use
          </button>
        </div>
      </div>
    </div>
  )
}
