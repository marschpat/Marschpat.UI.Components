import React, { useState, useRef, useEffect } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import DrawIcon from '@material-ui/icons/Create';
import TextIcon from '@material-ui/icons/Title';
import DeleteIcon from '@material-ui/icons/Delete';
import HandIcon from '@material-ui/icons/PanTool';
import EraserIcon from '@material-ui/icons/FormatColorReset';
import { SketchPicker } from 'react-color';
import { fabric } from 'fabric';

const Toolbar = ({ canvas }) => {
    const [mode, setMode] = useState('select'); // 'select', 'text', 'draw'
    const [colors, setColors] = React.useState(['#f00', '#0f0', '#00f', '#000']);
    const [anchorEl, setAnchorEl] = useState(null);
    const [textOptions, setTextOptions] = useState({
        size: 14,
        weight: 400, // Normal font weight
        italic: false,
    });
    const [selectedColor, setSelectedColor] = useState('red');
    const [lineWidth, setLineWidth] = useState(5); // Default line width
    const [colorPickerAnchorEl, setColorPickerAnchorEl] = React.useState(null);
    const [selectedColorIndex, setSelectedColorIndex] = React.useState(null);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorPickerRef = useRef();

    React.useEffect(() => {
        const handleClickOutside = e => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
                setShowColorPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [colorPickerRef]);

    useEffect(() => {
        if (canvas) {
            canvas.freeDrawingBrush.color = selectedColor;
        }
    }, [canvas, selectedColor]);

    useEffect(() => {
        const handleKeyDown = event => {
            if (event.key === 'Delete' && canvas && canvas.getActiveObject()) {
                canvas.remove(canvas.getActiveObject());
                canvas.renderAll();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [canvas]);

    useEffect(() => {
        if (mode === 'text' && canvas) {
            const handleMouseDown = options => {
                if (mode === 'text' && canvas) {
                    const pointer = canvas.getPointer(options.e);
                    const textObjects = canvas.getObjects('i-text');
                    let selectedTextObject = null;

                    textObjects.forEach(obj => {
                        if (
                            pointer.x >= obj.aCoords.tl.x &&
                            pointer.x <= obj.aCoords.br.x &&
                            pointer.y >= obj.aCoords.tl.y &&
                            pointer.y <= obj.aCoords.br.y
                        ) {
                            selectedTextObject = obj;
                        }
                    });

                    if (selectedTextObject) {
                        // Text object under cursor: select it for editing
                        canvas.setActiveObject(selectedTextObject);
                    } else {
                        // No text object under cursor: add a new one
                        const text = new fabric.IText('Your Text Here', {
                            left: pointer.x,
                            top: pointer.y,
                            fontSize: textOptions.size,
                            fontWeight: textOptions.weight,
                            fontStyle: textOptions.italic ? 'italic' : 'normal',
                            fill: selectedColor,
                            width: 200, // set a default width
                            height: 50, // and a default height
                            originX: 'left',
                            originY: 'top',
                        });
                        canvas.add(text);
                        canvas.setActiveObject(text);
                    }
                } else if (mode === 'erase') {
                    const pointer = canvas.getPointer(options.e);
                    const objects = canvas.getObjects();
                    objects.forEach(object => {
                        if (
                            pointer.x >= object.aCoords.tl.x &&
                            pointer.x <= object.aCoords.br.x &&
                            pointer.y >= object.aCoords.tl.y &&
                            pointer.y <= object.aCoords.br.y
                        ) {
                            canvas.remove(object);
                        }
                    });
                    canvas.renderAll(); // Ensure canvas gets re-rendered after an object is removed
                }
            };

            canvas.on('mouse:down', handleMouseDown);

            return () => canvas.off('mouse:down', handleMouseDown);
        }
    }, [mode, canvas, textOptions, selectedColor]);

    const handleCanvasMouseDown = o => {
        const pointer = canvas.getPointer(o.e);
        const text = new fabric.IText('Tap and Type', {
            left: pointer.x,
            top: pointer.y,
            fontSize: textOptions.size,
            fontWeight: textOptions.weight,
            fontStyle: textOptions.italic ? 'italic' : 'normal',
            fill: selectedColor,
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const handleModeChange = newMode => {
        if (!canvas) return;
        setMode(newMode);
        if (newMode === 'draw') {
            canvas.isDrawingMode = true;
            canvas.freeDrawingBrush.width = lineWidth; // Set line width here
            canvas.freeDrawingBrush.color = selectedColor;
        } else if (newMode === 'erase') {
            canvas.isDrawingMode = false;
            canvas.selection = false; // disable selection when erasing
            // additional setup for eraser mode if needed
        } else {
            canvas.isDrawingMode = false;
        }
    };

    const handleTextOptions = (property, value) => {
        setTextOptions(prev => ({ ...prev, [property]: value }));
    };

    const handleColorChange = color => {
        setSelectedColor(color.hex);
        setColors(prevColors => {
            const newColors = [...prevColors];
            newColors[selectedColorIndex] = color.hex;
            return newColors;
        });
    };

    const handleColorButtonClick = (color, index, event) => {
        setSelectedColor(color);
        setSelectedColorIndex(index);

        // Only toggle the color picker if the color is already selected.
        // Otherwise, set the color and keep the color picker closed.
        if (selectedColorIndex === index) {
            if (showColorPicker === true) {
                console.log('toggle color picker false');
                setShowColorPicker(false);
            } else {
                console.log('toggle color picker true');
                setShowColorPicker(true);
            }
        } else {
            setShowColorPicker(false);
        }
    };

    useEffect(() => {
        console.log('showColorPicker', showColorPicker);
    }, [showColorPicker]);

    const addText = options => {
        const text = new fabric.IText('Hello', options);
        canvas.add(text);
    };

    return (
        <div
            className="flex flex-row flex-wrap bg-gray-300 rounded p-2"
            style={{
                display: 'flex',
                backgroundColor: 'grey-700',
                borderRadius: '8px',
                alignItems: 'center',
                padding: '8px',
            }}
        >
            {/* Mode Buttons */}
            <IconButton
                color={mode === 'select' ? 'primary' : 'default'}
                onClick={() => handleModeChange('select')}
            >
                <HandIcon />
            </IconButton>
            <IconButton
                color={mode === 'text' ? 'primary' : 'default'}
                onClick={() => handleModeChange('text')}
            >
                <TextIcon />
            </IconButton>
            <IconButton
                color={mode === 'erase' ? 'primary' : 'default'}
                onClick={() => handleModeChange('erase')}
            >
                <EraserIcon />
            </IconButton>
            <IconButton
                color={mode === 'draw' ? 'primary' : 'default'}
                onClick={() => handleModeChange('draw')}
            >
                <DrawIcon />
            </IconButton>

            <Slider
                value={lineWidth}
                min={1}
                max={10}
                onChange={(e, newVal) => {
                    setLineWidth(newVal);
                    if (canvas) {
                        canvas.freeDrawingBrush.width = newVal;
                    }
                }}
                aria-labelledby="line-width-slider"
                className="w-32"
            />

            {/* Text Options */}
            <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
                <TextFieldsIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                style={{
                    top: '7%', // 10% from the top
                    width: '200px',
                }}
                className="flex flex-col"
            >
                <MenuItem className="flex flex-wrap">
                    <div className="text-gray-700 text-xl pb-4">Size:</div>
                    <Slider
                        min={2}
                        max={96}
                        value={textOptions.size}
                        onChange={(e, newVal) => handleTextOptions('size', newVal)}
                        aria-labelledby="size-slider"
                    />
                </MenuItem>
                <MenuItem className="flex flex-wrap">
                    <div className="text-gray-700 text-xl pb-4">Weight:</div>
                    <Slider
                        min={100}
                        max={900}
                        step={100}
                        value={textOptions.weight}
                        onChange={(e, newVal) => handleTextOptions('weight', newVal)}
                        aria-labelledby="weight-slider"
                    />
                </MenuItem>
                <MenuItem className="flex flex-row">
                    <div className="text-gray-700 text-xl pb-4">Italic:</div>
                    <IconButton
                        onClick={() => handleTextOptions('italic', !textOptions.italic)}
                        color={textOptions.italic ? 'primary' : 'default'}
                    >
                        <FormatItalicIcon />
                    </IconButton>
                </MenuItem>
            </Menu>

            {colors.map((color, index) => (
                <IconButton
                    key={color}
                    style={{
                        backgroundColor: color,
                        borderRadius: '50%',
                        border:
                            selectedColor === color ? '2px solid #2d2d2d' : '2px solid transparent',
                    }}
                    onClick={event => handleColorButtonClick(color, index, event)}
                />
            ))}

            {/* Color Picker */}
            {showColorPicker && (
                <div
                    style={{
                        position: 'fixed', // fixed will keep it in place even on scroll
                        zIndex: 2,
                        top: '10%', // 10% from the top
                        left: '50%', // Centered horizontally
                        transform: 'translateX(-50%)', // Ensure it is centered by translating it negatively along the X-axis by half its width
                    }}
                    ref={colorPickerRef} // Using ref to identify the color picker div
                >
                    <SketchPicker color={selectedColor} onChangeComplete={handleColorChange} />
                </div>
            )}
        </div>
    );
};

export default Toolbar;
