import React, { useState, useRef, useEffect } from 'react'
import { HotKeys } from 'react-hotkeys'
import { compose, withState } from 'recompose'
import { Media } from '../../api'
import { Sidebar } from './Sidebar'
import { withTracker } from '../components/withTracker'

export const MediaOverlay = compose(
  withState('currentMediaId', 'setCurrentMediaId'),
  withTracker(props => {
    if (!props.currentMediaId) { return props }
    const currentMedia = Media.findOne({ _id: props.currentMediaId })
    if (!currentMedia) { return props }

    return {
      ...props,
      currentMedia
    }
  })
)(({ patientId, appointmentId, currentMedia, currentMediaId, setCurrentMediaId, children }) => {
  // Reset state when media changes
  const setCurrentMediaIdShadowed = (_id) => {
    setCurrentMediaId(_id)
    setZoomed(false)
    setLoaded(false)
  }

  const [urlIndex, setUrlIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [zoomed, setZoomed] = useState()
  const imgRef = useRef(null)
  const modalRef = useRef(null)

  // Work around stale prop value in timeout effect handler
  const currentMediaRef = useRef(currentMedia)
  currentMediaRef.current = currentMedia
  const loadedRef = useRef(loaded)
  loadedRef.current = loaded

  useEffect(() => {
    if (currentMediaId && modalRef.current) {
      modalRef.current.focus()
    }

    const loadingTimeout = setTimeout(() => {
      if (currentMediaRef.current && !loadedRef.current) {
        handleError(new Error('Custom early image loading timeout fired'))
      }
    }, 2000)
    return () => clearTimeout(loadingTimeout)
  }, [currentMediaId, urlIndex])

  const url = currentMedia
  ? (currentMedia.urls[urlIndex] || currentMedia.urls[0])
  : null

  const handleLoad = () => {
    console.log('image loaded')
    setLoaded(true)
  }

  const handleError = (e) => {
    if (!currentMedia) {
      return
    }

    if (loaded) {
      console.log(`[media] fallback: image ${currentMedia._id} at url ${urlIndex} failed to load handler called but is already loaded, ignoring`)
      return
    }

    console.log(`[media] fallback: image ${currentMedia._id} at url ${urlIndex} failed to load`)

    setLoaded(false)
    setUrlIndex((urlIndex + 1) % currentMedia.urls.length)
  }

  const handleMediaClick = mediaId => {
    console.log('[Media] Viewing', mediaId)
    setCurrentMediaIdShadowed(mediaId)
  }
  const handleClose = () => setCurrentMediaIdShadowed(null)
  const toggleZoom = e => {
    e.stopPropagation()
    setZoomed(!zoomed)
    handleMouseMove(e, !zoomed)
  }

  const handleMouseMove = (e, overrideZoomed = null) => {
    if (imgRef.current) {
      imgRef.current.style.transform = imageTransform({
        zoomed: (overrideZoomed === null ? zoomed : overrideZoomed),
        mediaHeight: currentMedia.height,
        mediaWidth: currentMedia.width,
        mouseX: e.nativeEvent.clientX,
        mouseY: e.nativeEvent.clientY,
        rotation: currentMedia.rotation
      })
    }
  }

  return <>
    {
      currentMediaId && <HotKeys
        handler={{ CLOSE: handleClose }}
      >
        <div
          ref={modalRef}
          style={zoomed ? overlayZoomedStyle : overlayStyle}
          onClick={zoomed ? toggleZoom : handleClose}
          onMouseMove={zoomed ? handleMouseMove : null}
        >
          {
            !zoomed && <div style={closeStyle} onClick={handleClose}>
              ×
            </div>
          }

          <div
            style={zoomed ? zoomedSidebarStyle : sidebarStyle}
            onClick={stopPropagation}
          >
            <Sidebar
              patientId={patientId}
              appointmentId={appointmentId}
              media={currentMedia}
              setCurrentMediaId={setCurrentMediaIdShadowed}
            />
          </div>

          {currentMedia &&
            <div style={fitToScreen}>
              <img
                ref={imgRef}
                onClick={toggleZoom}
                src={url}
                onError={handleError}
                onLoad={handleLoad}
                style={imgStyle({
                  zoomed,
                  rotation: currentMedia.rotation,
                  mediaWidth: currentMedia.width,
                  mediaHeight: currentMedia.height
                })} />
            </div>
          }
        </div>
      </HotKeys>
    }
    {children({ handleMediaClick })}
  </>
})

const stopPropagation = e => e.stopPropagation()

const overlayStyle = {
  position: 'fixed',
  zIndex: 1370,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.85)',
  color: 'white',
  display: 'flex'
}

const overlayZoomedStyle = {
  ...overlayStyle,
  cursor: 'zoom-out'
}

const closeStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  opacity: 0.5,
  width: 80,
  height: 80,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'white',
  fontSize: '22px'
}

const fitToScreen = {
  width: 'calc(100% - 200px)',
  height: 'calc(100% - 50px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 30
}

const imgStyle = ({ zoomed, rotation, mediaWidth, mediaHeight }) => ({
  maxWidth: '100%',
  maxHeight: '100%',
  cursor: zoomed ? 'zoom-out' : 'zoom-in',
  transition: 'transform 300ms cubic-bezier(0.1, 0.81, 0.24, 1)',
  transform: imageTransform({ zoomed, rotation, mediaWidth, mediaHeight })
})

const imageTransform = ({ zoomed, mouseX, mouseY, mediaWidth, mediaHeight, rotation = 0 }) => {
  if (!zoomed) { return `rotate(${rotation}deg)` }

  const tX = (((window.innerWidth / 2) - mouseX) * 2) + 'px'
  const tY = (((window.innerHeight / 2) - mouseY) * 2) + 'px'

  const transform = `
    translateX(${tX})
    translateY(${tY})
    translateZ(0)
    scale(2)
    rotate(${rotation}deg)`

  return transform
}

const sidebarStyle = {
  width: 280,
  height: '100%',
  marginRight: 30,
  transition: 'opacity 150ms cubic-bezier(0.1, 0.81, 0.24, 1)'
}

const zoomedSidebarStyle = {
  ...sidebarStyle,
  opacity: 0.3
}
