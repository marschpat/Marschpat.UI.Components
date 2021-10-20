import React, { useContext } from 'react';
import TooltipStyled from '@marschpat/Marschpat.UI.Components/components/TooltipStyled';
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import Checkbox from '@material-ui/core/Checkbox';
import { UploaderContext } from '../../context/UploaderContext';

function HelpModeButton(props) {
    const { inHelpMode, setInHelpMode } = useContext(UploaderContext);

    return (
        <TooltipStyled title="Hilfe und Tips ein / ausblenden">
            <Checkbox
                checked={inHelpMode}
                onChange={e => setInHelpMode(e.target.checked)}
                icon={<EmojiObjectsOutlinedIcon className="text-5xl" fontSize="inherit" />}
                checkedIcon={
                    <EmojiObjectsIcon
                        className="text-5xl text-orange-300"
                        fonstSize="inherit"
                        color="inherit"
                    />
                }
            />
        </TooltipStyled>
    );
}

export default HelpModeButton;
