import React, { useContext, useState } from 'react';
import Icon from '@material-ui/core/Icon';
import Menu from '@material-ui/core/Menu';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { MusicsheetLoaderContext } from '../context/MusicsheetDisplayContexts';

const InstrumentVoiceSelector = () => {
    const [anchor, setAnchor] = useState(null);
    const { musicsheetMetaData, setInstrumentVoice } = useContext(MusicsheetLoaderContext);

    const handleOpen = e => {
        setAnchor(e.currentTarget);
    };
    const handleClose = () => {
        setAnchor(null);
    };
    function handleVoiceChange(voice) {
        setInstrumentVoice(voice);
        handleClose();
    }
    function checkIfVoiceShouldBeDisabled(voice) {
        const excludeVoiceIds = [];
        // const excludeVoiceIds = [1, 2, 73, 74];          // formerly disabled voices, currently all voices are available again

        return detectRenderType(voice) === 'mxl' && excludeVoiceIds.includes(voice.voiceID)
            ? true
            : false;
    }
    function detectRenderType(voice) {
        return voice.mxlAvailable ? 'mxl' : 'rendered';
    }
    function getVoiceIconPath(icon) {
        if (voicesIconsReference && voicesIconsReference.length > 0 && icon) {
            let refIcon = voicesIconsReference.find(ref => ref.referenceName === icon);
            if (refIcon) return refIcon.referencePath;
        }

        return 'default.jpg';
    }

    return (
        musicsheetMetaData.voices.length > 0 && (
            <div className="mx-20">
                <Tooltip title="Stimme auswählen">
                    <IconButton aria-label="Besetzung" color="inherit" onClick={handleOpen}>
                        <Badge badgeContent={musicsheetMetaData.voices.length} color="secondary">
                            <Icon>keyboard_voice</Icon>
                        </Badge>
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchor}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchor)}
                    onClose={handleClose}
                    id="voices-menu"
                >
                    {musicsheetMetaData.voices.map((voice, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => handleVoiceChange(voice)}
                            disabled={checkIfVoiceShouldBeDisabled(voice)}
                        >
                            <ListItemIcon className="">
                                <Avatar
                                    className="rounded-8 h-32 w-36 mx-4"
                                    alt="?"
                                    src={getVoiceIconPath(voice.icon)}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={voice.name}
                                secondary={
                                    `${voice.mxlAvailable ? 'MXL' : ''}` +
                                    `${voice.mxlAvailable && voice.renderedAvailable ? '/' : ''}` +
                                    `${voice.renderedAvailable ? 'BILD' : ''}`
                                }
                            />
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        )
    );
};

const voicesIconsReference = [
    {
        referenceName: 'instrument.voice.alto.saxophone.e.flat.1',
        referencePath: '/assets/images/icons_instruments/AltSax_1.svg',
    },
    {
        referenceName: 'instrument.voice.alto.saxophone.e.flat.2',
        referencePath: '/assets/images/icons_instruments/AltSax_2.svg',
    },
    {
        referenceName: 'instrument.saxophone',
        referencePath: '/assets/images/icons_instruments/BarSax.svg',
    },
    {
        referenceName: 'instrument.voice.basins',
        referencePath: '/assets/images/icons_instruments/Becken.svg',
    },
    {
        referenceName: 'instrument.directorate',
        referencePath: '/assets/images/icons_instruments/Direktion.svg',
    },
    {
        referenceName: 'instrument.bassoon',
        referencePath: '/assets/images/icons_instruments/Fagott.svg',
    },
    {
        referenceName: 'instrument.flute',
        referencePath: '/assets/images/icons_instruments/Floete.svg',
    },
    {
        referenceName: 'instrument.voice.flute.c.1',
        referencePath: '/assets/images/icons_instruments/Floete_1.svg',
    },
    {
        referenceName: 'instrument.voice.flute.c.2',
        referencePath: '/assets/images/icons_instruments/Floete_2.svg',
    },
    {
        referenceName: 'instrument.voice.flute.c.3',
        referencePath: '/assets/images/icons_instruments/Floete_3.svg',
    },
    {
        referenceName: 'instrument.flugelhorn',
        referencePath: '/assets/images/icons_instruments/Fluegelhorn.svg',
    },
    {
        referenceName: 'instrument.voice.flugelhorn.bb.1',
        referencePath: '/assets/images/icons_instruments/Fluegelhorn_1.svg',
    },
    {
        referenceName: 'instrument.voice.flugelhorn.bb.2',
        referencePath: '/assets/images/icons_instruments/Fluegelhorn_2.svg',
    },
    {
        referenceName: 'instrument.voice.flugelhorn.bb.3',
        referencePath: '/assets/images/icons_instruments/Fluegelhorn_3.svg',
    },
    {
        referenceName: 'instrument.singing',
        referencePath: '/assets/images/icons_instruments/Gesang.svg',
    },
    {
        referenceName: 'instrument.voice.carillon',
        referencePath: '/assets/images/icons_instruments/Glockenspiel.svg',
    },
    {
        referenceName: 'instrument.voice.bass.drum',
        referencePath: '/assets/images/icons_instruments/großeTrommel.svg',
    },
    {
        referenceName: 'instrument.group.direction',
        referencePath: '/assets/images/icons_instruments/Group-Direktion_Partitur_Gesang.svg',
    },
    {
        referenceName: 'instrument.group.highplate',
        referencePath: '/assets/images/icons_instruments/Group_HohesBlech.svg',
    },
    {
        referenceName: 'instrument.group.woodwinds',
        referencePath: '/assets/images/icons_instruments/Group_HolzBlass.svg',
    },
    {
        referenceName: 'instrument.group.percussion',
        referencePath: '/assets/images/icons_instruments/Group_Schlagzeug.svg',
    },
    {
        referenceName: 'instrument.group.deepplate',
        referencePath: '/assets/images/icons_instruments/Group_Tiefes_Blech.svg',
    },
    {
        referenceName: 'instrument.voice.horn.f.1',
        referencePath: '/assets/images/icons_instruments/Horn_1.svg',
    },
    {
        referenceName: 'instrument.voice.horn.f.2',
        referencePath: '/assets/images/icons_instruments/Horn_2.svg',
    },
    {
        referenceName: 'instrument.voice.horn.f.3',
        referencePath: '/assets/images/icons_instruments/Horn_3.svg',
    },
    {
        referenceName: 'instrument.voice.clarinet.1',
        referencePath: '/assets/images/icons_instruments/Klarinette_1.svg',
    },
    {
        referenceName: 'instrument.voice.clarinet.2',
        referencePath: '/assets/images/icons_instruments/Klarinette_2.svg',
    },
    {
        referenceName: 'instrument.voice.clarinet.3',
        referencePath: '/assets/images/icons_instruments/Klarinette_3.svg',
    },
    {
        referenceName: 'instrument.voice.snare.drum',
        referencePath: '/assets/images/icons_instruments/kleineTrommel.svg',
    },
    {
        referenceName: 'instrument.oboe',
        referencePath: '/assets/images/icons_instruments/Oboe.svg',
    },
    {
        referenceName: 'instrument.voice.timpani',
        referencePath: '/assets/images/icons_instruments/Pauken.svg',
    },
    {
        referenceName: 'instrument.voice.percussion',
        referencePath: '/assets/images/icons_instruments/Percussion.svg',
    },
    {
        referenceName: 'instrument.voice.small.c',
        referencePath: '/assets/images/icons_instruments/Picolo.svg',
    },
    {
        referenceName: 'instrument.trompone',
        referencePath: '/assets/images/icons_instruments/Posaune.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.c.1',
        referencePath: '/assets/images/icons_instruments/Posaune_1.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.c.2',
        referencePath: '/assets/images/icons_instruments/Posaune_2.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.c.3',
        referencePath: '/assets/images/icons_instruments/Posaune_3.svg',
    },
    {
        referenceName: 'instrument.voice.drums.combined',
        referencePath: '/assets/images/icons_instruments/Schlagzeug.svg',
    },
    {
        referenceName: 'instrument.tenorhorn',
        referencePath: '/assets/images/icons_instruments/Tenorhorn_Bassflgh.svg',
    },
    {
        referenceName: 'instrument.voice.tenor.saxophone.bb',
        referencePath: '/assets/images/icons_instruments/TenorSax_1.svg',
    },
    {
        referenceName: 'instrument.voice.tenor.saxophone.bb.2',
        referencePath: '/assets/images/icons_instruments/TenorSax_2.svg',
    },
    {
        referenceName: 'instrument.voice.triangle',
        referencePath: '/assets/images/icons_instruments/Triangel.svg',
    },
    {
        referenceName: 'instrument.trumpet',
        referencePath: '/assets/images/icons_instruments/Trompete.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.bb.1',
        referencePath: '/assets/images/icons_instruments/Trompete_1.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.bb.2',
        referencePath: '/assets/images/icons_instruments/Trompete_2.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.bb.3',
        referencePath: '/assets/images/icons_instruments/Trompete_3.svg',
    },
    {
        referenceName: 'instrument.tuba',
        referencePath: '/assets/images/icons_instruments/Tuba.svg',
    },
    {
        referenceName: 'instrument.voice.full.score',
        referencePath: '/assets/images/icons_instruments/Partitur.svg',
    },
    {
        referenceName: 'instrument.voice.directorate.c',
        referencePath: '/assets/images/icons_instruments/Diretkion_c.svg',
    },
    {
        referenceName: 'instrument.voice.singing.voice',
        referencePath: '/assets/images/icons_instruments/Singstimme.svg',
    },
    {
        referenceName: 'instrument.voice.oboe',
        referencePath: '/assets/images/icons_instruments/Oboe_vocie.svg',
    },
    {
        referenceName: 'instrument.clarinet',
        referencePath: '/assets/images/icons_instruments/Klarinette.png',
    },
    {
        referenceName: 'instrument.voice.clarinet.eb',
        referencePath: '/assets/images/icons_instruments/Klarinett_Bass.png',
    },
    {
        referenceName: 'instrument.vocie.clarinett.bass',
        referencePath: '/assets/images/icons_instruments/Klarinett_ES.png',
    },
    {
        referenceName: 'instrument.voice.bassoon',
        referencePath: '/assets/images/icons_instruments/Fagott_voice.svg',
    },
    {
        referenceName: 'instrument.voice.tenor.horn.bb.1',
        referencePath: '/assets/images/icons_instruments/Tenorhorn_Bassflgh_1.svg',
    },
    {
        referenceName: 'instrument.voice.tenor.horn.bb.2',
        referencePath: '/assets/images/icons_instruments/Tenorhorn_Bassflgh_2.svg',
    },
    {
        referenceName: 'instrument.voice.tenor.horn.bb.3',
        referencePath: '/assets/images/icons_instruments/Tenorhorn_Bassflgh_3.svg',
    },
    {
        referenceName: 'instrument.voice.bass.flugelhorn.bb',
        referencePath: '/assets/images/icons_instruments/Tenorhorn_Bassflgh_8.svg',
    },
    {
        referenceName: 'instrument.vocie.baritone.c',
        referencePath: '/assets/images/icons_instruments/Euphonium_Bariton_1.svg',
    },
    {
        referenceName: 'instrument.voice.baritone.b',
        referencePath: '/assets/images/icons_instruments/Euphonium_Bariton_2.svg',
    },
    {
        referenceName: 'instrument.voice.euphonium.bb',
        referencePath: '/assets/images/icons_instruments/Euphonium_Bariton_3.svg',
    },
    {
        referenceName: 'instrument.voice.euphonium.c',
        referencePath: '/assets/images/icons_instruments/Euphonium_Bariton_4.svg',
    },
    {
        referenceName: 'instrument.horn',
        referencePath: '/assets/images/icons_instruments/TieBlech_Horn.svg',
    },
    {
        referenceName: 'instrument.voice.horn.e.flat.1',
        referencePath: '/assets/images/icons_instruments/Horn_1_es.svg',
    },
    {
        referenceName: 'instrument.voice.horn.e.flat.2',
        referencePath: '/assets/images/icons_instruments/Horn_2_es.svg',
    },
    {
        referenceName: 'instrument.voice.horn.e.flat.3',
        referencePath: '/assets/images/icons_instruments/Horn_3_es.svg',
    },
    {
        referenceName: 'instrument.voice.horn.f.4',
        referencePath: '/assets/images/icons_instruments/Horn_4.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.b.1',
        referencePath: '/assets/images/icons_instruments/Posaune_1_b.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.b.2',
        referencePath: '/assets/images/icons_instruments/Posaune_2_b.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.b.3',
        referencePath: '/assets/images/icons_instruments/Posaune_3_b.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.bass',
        referencePath: '/assets/images/icons_instruments/Posaune_bass.svg',
    },
    {
        referenceName: 'instrument.voice.tuba.c.bass.1',
        referencePath: '/assets/images/icons_instruments/Tuba_1_c.svg',
    },
    {
        referenceName: 'instrument.voice.tuba.eb.bass',
        referencePath: '/assets/images/icons_instruments/Tuba_1_es.svg',
    },
    {
        referenceName: 'instrument.voice.tuba.c.bass.2',
        referencePath: '/assets/images/icons_instruments/Tuba_2_c.svg',
    },
    {
        referenceName: 'instrument.voice.tuba.b.bass',
        referencePath: '/assets/images/icons_instruments/Tuba_2_es.svg',
    },
    {
        referenceName: 'instrument.percussion',
        referencePath: '/assets/images/icons_instruments/Schlagwerk.svg',
    },
    {
        referenceName: 'instrument.percussion',
        referencePath: '/assets/images/icons_instruments/Schlagwerk.svg',
    },
    {
        referenceName: 'instrument.voice.baritone.saxophone.e.flat',
        referencePath: '/assets/images/icons_instruments/Holz_BarSax.svg',
    },
    {
        referenceName: 'instrument.voice.baritone.saxophone.e.flat',
        referencePath: '/assets/images/icons_instruments/Holz_BassKlar.svg',
    },
    {
        referenceName: 'instrument.voice.bariton.b',
        referencePath: '/assets/images/icons_instruments/TieBlech_Euphonium_Bariton_b.svg',
    },
    {
        referenceName: 'instrument.voice.baritone.c',
        referencePath: '/assets/images/icons_instruments/TieBlech_Euphonium_Bariton_c.svg',
    },
    {
        referenceName: 'instrument.voice.horn.e.flat.4',
        referencePath: '/assets/images/icons_instruments/Horn_4_es.svg',
    },
    {
        /*ADDED MANUALLY*/
        referenceName: 'instrument.voice.clarinet.bass',
        referencePath: '/assets/images/icons_instruments/Klarinette_3.svg',
    },
    {
        /*ADDED MANUALLY*/
        referenceName: 'instrument.voice.string.bass.c',
        referencePath: '/assets/images/icons_instruments/Tuba_2_es.svg',
    },
];

export default InstrumentVoiceSelector;
