import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';

const InstrumentVoiceBuilder = props => {
    const age = 20;
    return (
        <div className="mt-20">
            {/* INSTRUMENT */}
            <div>
                <Typography variant="h6">Instrument auswählen *</Typography>
                <FormControl fullWidth>
                    <InputLabel id="variant-clef">Instrument</InputLabel>
                    <Select
                        labelId="variant-clef"
                        value=""
                        label="Instrument"
                        variant="outlined"
                        // onChange={handleChange}
                    >
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                </FormControl>
            </div>

            {/* MOOO */}
            <FormControl fullWidth>
                <InputLabel id="mood-clef">Stimmung</InputLabel>
                <Select
                    labelId="mood-clef"
                    value=""
                    label="Stimmung"
                    // onChange={handleChange}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>

            {/* VARIANT */}
            <FormControl fullWidth>
                <InputLabel id="variant-clef">Variante</InputLabel>
                <Select
                    labelId="variant-clef"
                    value=""
                    label="variant"
                    // onChange={handleChange}
                >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
};

export default InstrumentVoiceBuilder;
