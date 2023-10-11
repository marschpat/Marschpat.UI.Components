import React, { useState, useRef, useEffect } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import TextIcon from '@material-ui/icons/Title';
import DeleteIcon from '@material-ui/icons/Delete';
import HandIcon from '@material-ui/icons/PanTool';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Gesture from '@material-ui/icons/Gesture';
import { SketchPicker } from 'react-color';
import { fabric } from 'fabric';
import { set } from 'lodash';

const Toolbar = ({ canvas }) => {
    const [mode, setMode] = useState('select'); // 'select', 'text', 'draw'
    const [colors, setColors] = React.useState(['#E10101', '#03AF03', '#4444F3', '#9013FE']);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isTextOptionsOpen, setIsTextOptionsOpen] = useState(false);
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

    useEffect(() => {
        setSelectedColor(colors[0]);
        setSelectedColorIndex(0);
    }, []);

    useEffect(() => {
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
        if (canvas && mode === 'select' && selectedColor) {
            const activeObject = canvas.getActiveObject();
            if (activeObject === undefined || activeObject === null) return;
            if (activeObject.type === 'i-text') {
                activeObject.set({ fill: selectedColor });
                canvas.renderAll();
            }
        }
    }, [canvas, mode, selectedColor]);

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
                    // Change mode back to select after adding or selecting text
                    setMode('select');
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

    const handleDelete = () => {
        if (!canvas) return;
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects === undefined || activeObjects === null) return;
        if (activeObjects.length) {
            canvas.remove(...activeObjects);
            canvas.discardActiveObject(); // clear the selection after deleting the objects
            canvas.renderAll();
        }
    };

    useEffect(() => {
        if (canvas && mode === 'select') {
            const handleSelectionCreated = e => {
                const activeObject = e.target;

                if (activeObject === undefined || activeObject === null) return;
                if (activeObject.type === 'i-text') {
                    setTextOptions({
                        size: activeObject.fontSize,
                        weight: activeObject.fontWeight,
                        italic: activeObject.fontStyle === 'italic',
                    });
                }
            };

            const handleSelectionCleared = () => {
                setTextOptions({
                    size: 14,
                    weight: 400,
                    italic: false,
                });
            };

            canvas.on('selection:created', handleSelectionCreated);
            canvas.on('selection:cleared', handleSelectionCleared);

            return () => {
                canvas.off('selection:created', handleSelectionCreated);
                canvas.off('selection:cleared', handleSelectionCleared);
            };
        }
    }, [canvas, mode]);

    useEffect(() => {
        if (canvas && mode === 'select') {
            const activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'i-text') {
                activeObject.set({
                    fontSize: textOptions.size,
                    fontWeight: textOptions.weight,
                    fontStyle: textOptions.italic ? 'italic' : 'normal',
                });
                canvas.requestRenderAll();
            }
        }
    }, [canvas, mode, textOptions]);

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
                setShowColorPicker(false);
            } else {
                setShowColorPicker(true);
            }
        } else {
            setShowColorPicker(false);
        }
    };

    const addText = options => {
        const text = new fabric.IText('Hello', options);
        canvas.add(text);
    };

    return (
        <div className="flex flex-row bg-gray-900 justify-center items-center h-32">
            {/* Mode Buttons */}
            <div className="flex flex-row bg-gray-700 rounded justify-between items-center p-4 mr-16">
                <div
                    className="flex flex-wrap rounded"
                    style={{
                        background: mode === 'select' ? 'rgb(220, 173, 85)' : 'transparent',
                    }}
                >
                    <IconButton onClick={() => handleModeChange('select')} className="w-32 h-32">
                        <HandIcon
                            style={{
                                color: 'white',
                                width: '20px',
                                height: '20px',
                            }}
                        />
                    </IconButton>
                </div>
                <div
                    className="flex flex-wrap rounded mr-4 ml-4"
                    style={{
                        background: mode === 'draw' ? 'rgb(220, 173, 85)' : 'transparent',
                    }}
                >
                    <IconButton onClick={() => handleModeChange('draw')} className="w-32 h-32">
                        <Gesture
                            style={{
                                color: 'white',
                                width: '24px',
                                height: '24px',
                            }}
                        />
                    </IconButton>
                </div>
                <div
                    className="flex flex-wrap rounded"
                    style={{
                        background: mode === 'text' ? 'rgb(220, 173, 85)' : 'transparent',
                    }}
                >
                    <IconButton onClick={() => handleModeChange('text')} className="w-32 h-32">
                        <TextIcon
                            style={{
                                color: 'white',
                                width: '24px',
                                height: '24px',
                            }}
                        />
                    </IconButton>
                </div>
            </div>
            <div className="flex flex-row ml-8 mr-8">
                {mode === 'draw' && (
                    <div className="grid w-64">
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
                            style={{ color: 'white' }}
                        />
                    </div>
                )}
                {mode !== 'draw' && (
                    <IconButton
                        onClick={e => {
                            setAnchorEl(e.currentTarget);
                            setIsTextOptionsOpen(true);
                        }}
                        className="w-32 h-32 ml-16 mr-16"
                    >
                        <TextFieldsIcon
                            style={{
                                color: 'white',
                                width: '32px',
                                height: '32px',
                            }}
                        />
                        <ExpandMoreIcon
                            style={{
                                color: 'white',
                                width: '16px',
                                height: '16px',
                            }}
                        />
                    </IconButton>
                )}
            </div>

            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={isTextOptionsOpen}
                onClose={() => setIsTextOptionsOpen(false)}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                style={{
                    top: '5%', // 10% from the top
                    width: '250px',
                }}
            >
                <MenuItem className="flex flex-wrap">
                    <div className="text-xl pb-4">Size:</div>
                    <Slider
                        min={2}
                        max={96}
                        value={textOptions.size}
                        onChange={(e, newVal) => handleTextOptions('size', newVal)}
                        aria-labelledby="size-slider"
                    />
                </MenuItem>
                <MenuItem className="flex flex-wrap">
                    <div className="text-xl pb-4">Weight:</div>
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
                    <div className="text-xl pb-4">Italic:</div>
                    <IconButton
                        onClick={() => handleTextOptions('italic', !textOptions.italic)}
                        color={textOptions.italic ? 'primary' : 'default'}
                    >
                        <FormatItalicIcon />
                    </IconButton>
                </MenuItem>
            </Menu>

            {/* Color Buttons */}
            <div className="flex flex-row ml-4 mr-4">
                {colors.map((color, index) => (
                    <IconButton
                        key={color}
                        style={{
                            backgroundColor: color,
                            borderRadius: '50%',
                            border:
                                selectedColor === color
                                    ? '2px solid #dddddd'
                                    : '2px solid transparent',
                        }}
                        onClick={event => handleColorButtonClick(color, index, event)}
                        className="m-4 w-28 h-28"
                    ></IconButton>
                ))}
            </div>

            {/* Delete Button */}
            <IconButton onClick={handleDelete} className="w-32 h-32">
                <DeleteIcon
                    style={{
                        color: 'white',
                        width: '24px',
                        height: '24px',
                    }}
                />
            </IconButton>

            {/* Color Picker */}
            {showColorPicker && (
                <div
                    style={{
                        position: 'fixed', // fixed will keep it in place even on scroll
                        zIndex: 2,
                        top: '7%', // 10% from the top
                        left: '50%', // Centered horizontally
                        transform: 'translateX(-50%)', // Ensure it is centered by translating it negatively along the X-axis by half its width
                    }}
                    ref={colorPickerRef} // Using ref to identify the color picker div
                >
                    <SketchPicker
                        color={selectedColor}
                        className="text-gray-900"
                        onChangeComplete={handleColorChange}
                    />
                </div>
            )}
        </div>
    );
};

export default Toolbar;
