import { useRef, useEffect } from 'react'

const useCanvas = draw => {

  const canvasRef = useRef(null)

  useEffect(() => {

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId

    const render = () => {
      const map_img = new Image()
      map_img.src = "jpMap_600x750.png"
      canvas.width = map_img.width
      canvas.height = map_img.height
      context.drawImage(map_img, 0, 0)
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return canvasRef
}

export default useCanvas