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
import { useTranslation } from 'react-i18next';

const InstrumentVoiceSelector = () => {
    const { t } = useTranslation(['msd']);
    const [anchor, setAnchor] = useState(null);
    const { musicsheetMetaData, setInstrumentVoice } = useContext(MusicsheetLoaderContext);

    const handleOpen = e => {
        setAnchor(e.currentTarget);
    };
    const handleClose = () => {
        setAnchor(null);
    };

    // set InstrumentVoice and persist as my favourite voice to local storage
    function handleVoiceChange(voice) {
        setInstrumentVoice(voice);
        localStorage.setItem('favVoice', JSON.stringify(voice));
        handleClose();
    }
    function checkIfVoiceShouldBeDisabled(voice) {
        const excludeVoiceIds = [];
        // const excludeVoiceIds = [1, 2, 73, 74];          // formerly disabled voices, currently all voices are available again

        return detectRenderType(voice) === 'mxl' && excludeVoiceIds.includes(voice.voiceId)
            ? true
            : false;
    }
    function detectRenderType(voice) {
        return voice.mxlAvailable ? 'mxl' : 'rendered';
    }
    function getVoiceIconPath(icon) {
        let newIcon = tryGetNewVoiceIconPath(icon);
        if (newIcon !== null) {
            return newIcon;
        } else {
            return getOldVoiceIconPath(icon);
        }
    }
    function getOldVoiceIconPath(icon) {
        if (voicesOldIconsReference && voicesOldIconsReference.length > 0 && icon) {
            let refIcon = voicesOldIconsReference.find(ref => ref.referenceName === icon);
            if (refIcon) return refIcon.referencePath;
        }

        return 'default.jpg';
    }
    function tryGetNewVoiceIconPath(icon) {
        if (voicesNewIconsReference && voicesNewIconsReference.length > 0 && icon) {
            let refIcon = voicesNewIconsReference.find(ref => ref.referenceName === icon);
            if (refIcon) return refIcon.referencePath;
        }

        return null;
    }

    return (
        musicsheetMetaData.voices.length > 0 && (
            <div className="mx-20">
                <Tooltip title={t('MSD_SELECT_VOICE')}>
                    <IconButton aria-label={t('MSD_CAST')} color="inherit" onClick={handleOpen}>
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
                                <img
                                    className="h-60 w-60 mx-4 rounded-2 object-contain"
                                    alt="?"
                                    src={getVoiceIconPath(voice.icon)}
                                />
                            </ListItemIcon>
                            <ListItemText
                                primary={voice.name}
                                secondary={
                                    `${voice.mxlAvailable ? 'MXL' : ''}` +
                                    `${voice.mxlAvailable && voice.renderedAvailable ? '/' : ''}` +
                                    `${voice.renderedAvailable ? t('MSD_IMG') : ''}`
                                }
                            />
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        )
    );
};
const voicesOldIconsReference = [
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
        referenceName: 'instrument.voice.clarinet.bass',
        referencePath: '/assets/images/icons_instruments/Klarinette_3.svg',
    },
    {
        referenceName: 'instrument.voice.string.bass.c',
        referencePath: '/assets/images/icons_instruments/Tuba_2_es.svg',
    },
];
const voicesNewIconsReference = [
    {
        referenceName: 'instrument.bassoon',
        referencePath: '/assets/images/icons_instruments_new/instrument.bassoon.svg',
    },
    {
        referenceName: 'instrument.cast.largewindorchestra',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.cast.largewindorchestra.svg',
    },
    {
        referenceName: 'instrument.cast.posaunenchor',
        referencePath: '/assets/images/icons_instruments_new/instrument.cast.posaunenchor.svg',
    },
    {
        referenceName: 'instrument.clarinet',
        referencePath: '/assets/images/icons_instruments_new/instrument.clarinet.svg',
    },
    {
        referenceName: 'instrument.cornett.piston',
        referencePath: '/assets/images/icons_instruments_new/instrument.cornett.piston.svg',
    },
    {
        referenceName: 'instrument.directorate',
        referencePath: '/assets/images/icons_instruments_new/instrument.directorate.svg',
    },
    {
        referenceName: 'instrument.flugelhorn',
        referencePath: '/assets/images/icons_instruments_new/instrument.flugelhorn.svg',
    },
    {
        referenceName: 'instrument.flute',
        referencePath: '/assets/images/icons_instruments_new/instrument.flute.svg',
    },
    {
        referenceName: 'instrument.group.deepplate',
        referencePath: '/assets/images/icons_instruments_new/instrument.group.deepplate.svg',
    },
    {
        referenceName: 'instrument.group.direction',
        referencePath: '/assets/images/icons_instruments_new/instrument.group.direction.svg',
    },
    {
        referenceName: 'instrument.group.highplate',
        referencePath: '/assets/images/icons_instruments_new/instrument.group.highplate.svg',
    },
    {
        referenceName: 'instrument.group.others',
        referencePath: '/assets/images/icons_instruments_new/instrument.group.others.svg',
    },
    {
        referenceName: 'instrument.group.percussion',
        referencePath: '/assets/images/icons_instruments_new/instrument.group.percussion.svg',
    },
    {
        referenceName: 'instrument.group.woodwinds',
        referencePath: '/assets/images/icons_instruments_new/instrument.group.woodwinds.svg',
    },
    {
        referenceName: 'instrument.horn',
        referencePath: '/assets/images/icons_instruments_new/instrument.horn.svg',
    },
    {
        referenceName: 'instrument.marimba',
        referencePath: '/assets/images/icons_instruments_new/instrument.marimba.svg',
    },
    {
        referenceName: 'instrument.oboe',
        referencePath: '/assets/images/icons_instruments_new/instrument.oboe.svg',
    },
    {
        referenceName: 'instrument.pauken',
        referencePath: '/assets/images/icons_instruments_new/instrument.pauken.svg',
    },
    {
        referenceName: 'instrument.percussion',
        referencePath: '/assets/images/icons_instruments_new/instrument.percussion.svg',
    },
    {
        referenceName: 'instrument.saxophone',
        referencePath: '/assets/images/icons_instruments_new/instrument.saxophone.svg',
    },
    {
        referenceName: 'instrument.singing',
        referencePath: '/assets/images/icons_instruments_new/instrument.singing.svg',
    },
    {
        referenceName: 'instrument.tamtam.gong',
        referencePath: '/assets/images/icons_instruments_new/instrument.tamtam.gong.svg',
    },
    {
        referenceName: 'instrument.tenorhorn',
        referencePath: '/assets/images/icons_instruments_new/instrument.tenorhorn.svg',
    },
    {
        referenceName: 'instrument.trompone',
        referencePath: '/assets/images/icons_instruments_new/instrument.trompone.svg',
    },
    {
        referenceName: 'instrument.trumpet',
        referencePath: '/assets/images/icons_instruments_new/instrument.trumpet.svg',
    },
    {
        referenceName: 'instrument.tuba',
        referencePath: '/assets/images/icons_instruments_new/instrument.tuba.svg',
    },
    {
        referenceName: 'instrument.voice.alto.saxophone.e.flat.1',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.alto.saxophone.e.flat.1.svg',
    },
    {
        referenceName: 'instrument.voice.alto.saxophone.e.flat.2',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.alto.saxophone.e.flat.2.svg',
    },
    {
        referenceName: 'instrument.voice.alto.saxophone.e.flat.3',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.alto.saxophone.e.flat.3.svg',
    },
    {
        referenceName: 'instrument.voice.bariton.b',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.bariton.b.svg',
    },
    {
        referenceName: 'instrument.voice.baritone.c.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.baritone.c.2.svg',
    },
    {
        referenceName: 'instrument.voice.baritone.c.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.baritone.c.3.svg',
    },
    {
        referenceName: 'instrument.voice.baritone.c',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.baritone.c.svg',
    },
    {
        referenceName: 'instrument.voice.baritone.saxophone.e.flat',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.baritone.saxophone.e.flat.svg',
    },
    {
        referenceName: 'instrument.voice.basins',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.basins.svg',
    },
    {
        referenceName: 'instrument.voice.bass.drum',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.bass.drum.svg',
    },
    {
        referenceName: 'instrument.voice.bass.flugelhorn.bb',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.bass.flugelhorn.bb.svg',
    },
    {
        referenceName: 'instrument.voice.bass.trumpet.bb',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.bass.trumpet.bb.svg',
    },
    {
        referenceName: 'instrument.voice.bassoon.c.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.bassoon.c.1.svg',
    },
    {
        referenceName: 'instrument.voice.bassoon.c.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.bassoon.c.2.svg',
    },
    {
        referenceName: 'instrument.voice.bongos',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.bongos.svg',
    },
    {
        referenceName: 'instrument.voice.carillon',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.carillon.svg',
    },
    {
        referenceName: 'instrument.voice.clarinet.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.clarinet.1.svg',
    },
    {
        referenceName: 'instrument.voice.clarinet.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.clarinet.2.svg',
    },
    {
        referenceName: 'instrument.voice.clarinet.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.clarinet.3.svg',
    },
    {
        referenceName: 'instrument.voice.clarinet.bass',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.clarinet.bass.svg',
    },
    {
        referenceName: 'instrument.voice.clarinet.c',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.clarinet.c.svg',
    },
    {
        referenceName: 'instrument.voice.clarinet.eb',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.clarinet.eb.svg',
    },
    {
        referenceName: 'instrument.voice.congas',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.congas.svg',
    },
    {
        referenceName: 'instrument.voice.directorate.bb',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.directorate.bb.svg',
    },
    {
        referenceName: 'instrument.voice.directorate.c',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.directorate.c.svg',
    },
    {
        referenceName: 'instrument.voice.drums.combined',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.drums.combined.svg',
    },
    {
        referenceName: 'instrument.voice.euphonium.bb',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.euphonium.bb.svg',
    },
    {
        referenceName: 'instrument.voice.euphonium.c',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.euphonium.c.svg',
    },
    {
        referenceName: 'instrument.voice.flugelhorn.bb.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.flugelhorn.bb.1.svg',
    },
    {
        referenceName: 'instrument.voice.flugelhorn.bb.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.flugelhorn.bb.2.svg',
    },
    {
        referenceName: 'instrument.voice.flugelhorn.bb.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.flugelhorn.bb.3.svg',
    },
    {
        referenceName: 'instrument.voice.flugelhorn.bb.4',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.flugelhorn.bb.4.svg',
    },
    {
        referenceName: 'instrument.voice.flugelhorn.c.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.flugelhorn.c.1.svg',
    },
    {
        referenceName: 'instrument.voice.flugelhorn.c.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.flugelhorn.c.2.svg',
    },
    {
        referenceName: 'instrument.voice.flugelhorn.c.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.flugelhorn.c.3.svg',
    },
    {
        referenceName: 'instrument.voice.flugelhorn.c.4',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.flugelhorn.c.4.svg',
    },
    {
        referenceName: 'instrument.voice.flute.c.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.flute.c.1.svg',
    },
    {
        referenceName: 'instrument.voice.flute.c.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.flute.c.2.svg',
    },
    {
        referenceName: 'instrument.voice.flute.c.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.flute.c.3.svg',
    },
    {
        referenceName: 'instrument.voice.fullscore.bb',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.fullscore.bb.svg',
    },
    {
        referenceName: 'instrument.voice.fullscore.c',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.fullscore.c.svg',
    },
    {
        referenceName: 'instrument.voice.horn.e.flat.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.horn.e.flat.1.svg',
    },
    {
        referenceName: 'instrument.voice.horn.e.flat.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.horn.e.flat.2.svg',
    },
    {
        referenceName: 'instrument.voice.horn.e.flat.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.horn.e.flat.3.svg',
    },
    {
        referenceName: 'instrument.voice.horn.e.flat.4',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.horn.e.flat.4.svg',
    },
    {
        referenceName: 'instrument.voice.horn.f.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.horn.f.1.svg',
    },
    {
        referenceName: 'instrument.voice.horn.f.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.horn.f.2.svg',
    },
    {
        referenceName: 'instrument.voice.horn.f.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.horn.f.3.svg',
    },
    {
        referenceName: 'instrument.voice.horn.f.4',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.horn.f.4.svg',
    },
    {
        referenceName: 'instrument.voice.kornett.es.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.kornett.es.1.svg',
    },
    {
        referenceName: 'instrument.voice.kornett.es.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.kornett.es.2.svg',
    },
    {
        referenceName: 'instrument.voice.lyre',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.lyre.svg',
    },
    {
        referenceName: 'instrument.voice.oboe.c.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.oboe.c.1.svg',
    },
    {
        referenceName: 'instrument.voice.oboe.c.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.oboe.c.2.svg',
    },
    {
        referenceName: 'instrument.voice.percussion.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.percussion.1.svg',
    },
    {
        referenceName: 'instrument.voice.percussion.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.percussion.2.svg',
    },
    {
        referenceName: 'instrument.voice.percussion.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.percussion.3.svg',
    },
    {
        referenceName: 'instrument.voice.singing.voice',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.singing.voice.svg',
    },
    {
        referenceName: 'instrument.voice.small.c',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.small.c.svg',
    },
    {
        referenceName: 'instrument.voice.snare.drum',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.snare.drum.svg',
    },
    {
        referenceName: 'instrument.voice.soprano.saxophone.bb',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.soprano.saxophone.bb.svg',
    },
    {
        referenceName: 'instrument.voice.string.bass.c',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.string.bass.c.svg',
    },
    {
        referenceName: 'instrument.voice.tamburin',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.tamburin.svg',
    },
    {
        referenceName: 'instrument.voice.tenor.horn.bb.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.tenor.horn.bb.1.svg',
    },
    {
        referenceName: 'instrument.voice.tenor.horn.bb.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.tenor.horn.bb.2.svg',
    },
    {
        referenceName: 'instrument.voice.tenor.horn.bb.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.tenor.horn.bb.3.svg',
    },
    {
        referenceName: 'instrument.voice.tenor.saxophone.bb.1',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.tenor.saxophone.bb.1.svg',
    },
    {
        referenceName: 'instrument.voice.tenor.saxophone.bb.2',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.tenor.saxophone.bb.2.svg',
    },
    {
        referenceName: 'instrument.voice.tenor.saxophone.bb.3',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.tenor.saxophone.bb.3.svg',
    },
    {
        referenceName: 'instrument.voice.timpani',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.timpani.svg',
    },
    {
        referenceName: 'instrument.voice.triangle',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.triangle.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.b.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trombone.b.1.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.b.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trombone.b.2.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.b.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trombone.b.3.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.b.4',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trombone.b.4.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.bass',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trombone.bass.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.c.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trombone.c.1.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.c.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trombone.c.2.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.c.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trombone.c.3.svg',
    },
    {
        referenceName: 'instrument.voice.trombone.c.4',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trombone.c.4.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.bb.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trumpet.bb.1.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.bb.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trumpet.bb.2.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.bb.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trumpet.bb.3.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.bb.4',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trumpet.bb.4.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.c.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trumpet.c.1.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.c.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trumpet.c.2.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.c.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trumpet.c.3.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.c.4',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trumpet.c.4.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.e.flat.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trumpet.e.flat.1.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.e.flat.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trumpet.e.flat.2.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.e.flat.3',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trumpet.e.flat.3.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.e.flat.4',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.trumpet.e.flat.4.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.piccolo.b.1',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.trumpet.piccolo.b.1.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.piccolo.b.2',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.trumpet.piccolo.b.2.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.piccolo.b.3',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.trumpet.piccolo.b.3.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.piccolo.c.1',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.trumpet.piccolo.c.1.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.piccolo.c.2',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.trumpet.piccolo.c.2.svg',
    },
    {
        referenceName: 'instrument.voice.trumpet.piccolo.c.3',
        referencePath:
            '/assets/images/icons_instruments_new/instrument.voice.trumpet.piccolo.c.3.svg',
    },
    {
        referenceName: 'instrument.voice.tuba.b.bass',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.tuba.b.bass.svg',
    },
    {
        referenceName: 'instrument.voice.tuba.c.bass.1',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.tuba.c.bass.1.svg',
    },
    {
        referenceName: 'instrument.voice.tuba.c.bass.2',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.tuba.c.bass.2.svg',
    },
    {
        referenceName: 'instrument.voice.tuba.eb.bass',
        referencePath: '/assets/images/icons_instruments_new/instrument.voice.tuba.eb.bass.svg',
    },
    {
        referenceName: 'instrument.xylophon',
        referencePath: '/assets/images/icons_instruments_new/instrument.xylophon.svg',
    },
    {
        referenceName: 'Selector_Group_white',
        referencePath: '/assets/images/icons_instruments_new/Selector_Group_white.svg',
    },
    {
        referenceName: 'Selector_Group',
        referencePath: '/assets/images/icons_instruments_new/Selector_Group.svg',
    },
    {
        referenceName: 'Selector_Instrument_white',
        referencePath: '/assets/images/icons_instruments_new/Selector_Instrument_white.svg',
    },
    {
        referenceName: 'Selector_Instrument',
        referencePath: '/assets/images/icons_instruments_new/Selector_Instrument.svg',
    },
    {
        referenceName: 'Selector_Voice_white',
        referencePath: '/assets/images/icons_instruments_new/Selector_Voice_white.svg',
    },
    {
        referenceName: 'Selector_Voice',
        referencePath: '/assets/images/icons_instruments_new/Selector_Voice.svg',
    },
];
export default InstrumentVoiceSelector;
