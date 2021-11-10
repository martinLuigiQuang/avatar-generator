import * as React from 'react';
import * as HtmlToImage from 'html-to-image';
import { ScaledUploadedPhoto } from './FacialLandmarksHelper';
import locale from '../data/locales.json';

const AvatarDownload = (props) => {
    const { language, avatar } = props;
    const canvasRef = React.useRef(null);
    const avatarImageRef = React.createRef(null);
    console.log(avatar)

    React.useEffect(
        () => {
            if (avatar) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.drawImage()
            }
        },
        [avatar]
    );

    return (
        <>
            <canvas ref={canvasRef} />
        </>
    );
};

export default AvatarDownload;
