import React from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import IconButton from '@material-ui/core/IconButton';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const MxlInfoButton = props => {
    return (
        <TooltipStyled
            title={
                <>
                    <p>Wenn möglich werden die Voreinstellungen aus dem MXL-File übernommen</p>
                    <ul className="list-disc list-inside">
                        <li>Zeilenumbrüche aus MXL</li>
                        <li>Seitenumbrüche aus MXL</li>
                    </ul>
                    <p className="mt-16">
                        Es wird empfohlen MXL-Files ab Version 3.0 zu verwenden, um eine optimale Darstellung zu
                        ermöglichen.
                    </p>
                </>
            }
        >
            <IconButton>
                <InfoOutlinedIcon classes={{ root: 'w-28 h-28' }} />
            </IconButton>
        </TooltipStyled>
    );
};

export default MxlInfoButton;
