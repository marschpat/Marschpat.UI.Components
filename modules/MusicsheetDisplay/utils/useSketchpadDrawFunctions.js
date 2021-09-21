import LoginForm from 'app/main/login/LoginForm';
import { useState } from 'react';

const useSketchpadDrawFunctions = mode => {
    const [ctx, setCtx] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    function drawDot(size = 5) {
        setIsDrawing(true);
        ctx.beginPath();
        ctx.arc(position.x, position.y, size, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    function drawFree(e) {
        const color = mode.color ?? '#000';
        const size = mode.size ?? 5;
        ctx.fillStyle = color;
        ctx.globalAlpha = mode.opacity ?? 1;
        updatePosition(e);
        if (isDrawing) drawDot(size);
    }

    function fillText(e) {
        const pos = updatePosition(e);
        ctx.font = 'italic 18px Arial';
        ctx.fillText('Hello World', pos.x, pos.y);
    }

    function stopDrawing() {
        setIsDrawing(false);
    }

    // Get the current cursor / touch position relative to the top-left of the canvas
    function updatePosition(e) {
        let pos = { x: 0, y: 0 };
        if (e.nativeEvent.offsetX) {
            pos = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
        } else if (e.nativeEvent.layerX) {
            pos = { x: e.nativeEvent.layerX, y: e.nativeEvent.layerY };
        }
        setPosition(pos);
        return pos;
    }

    return [setCtx, drawDot, drawFree, stopDrawing, fillText];
};

export default useSketchpadDrawFunctions;
