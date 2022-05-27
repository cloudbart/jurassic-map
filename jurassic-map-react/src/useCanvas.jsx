import { useRef, useEffect } from 'react';

const useCanvas = draw => {

  const canvasRef = useRef(null);

  useEffect(() => {

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    var background = new Image();
    background.src = "jpMap_2261x2492.png";
    let frameCount = 0;
    let animationFrameId;

    const render = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(background,0,0);
      frameCount++;
      draw(context, frameCount);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return canvasRef;
};

export default useCanvas;