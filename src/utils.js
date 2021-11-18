import ApplicationConstants from "./data/constants";

class Utils {
    PERIMETER = [
        103,
        54,
        21,
        162,
        127,
        234,
        93,
        132,
        58,
        172,
        136,
        150,
        149,
        176,
        148,
        152,
        377,
        400,
        378,
        379,
        365,
        397,
        288,
        361,
        323,
        454,
        356,
        389,
        251,
        284,
        332,
        297,
        338,
        10,
        109,
        67, 
        103
    ];
    
    drawPath = (ctx, points, closePath) => {
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            ctx.lineTo(point[0], point[1]);
        }
        
        if (closePath) {
            ctx.closePath();
        }
    };
    
    getPoints = (keypoints, width, height) => {
        const points = this.PERIMETER.map(index => keypoints[index]);
        const leftHalf = points.slice(0, 18);
        const rightHalf = points.slice(17, 37);
        rightHalf.unshift([width, 0, 0], [width, height, 0]);
        rightHalf.push([0, 0, 0]);
        leftHalf.unshift([0, height, 0], [0, 0, 0]);
        leftHalf.push([width, height, 0]);
        return [leftHalf, rightHalf];
    };
    
    getDistance = (point1, point2) => {
        const dx_sq = (point2[0] - point1[0]) * (point2[0] - point1[0]);
        const dy_sq = (point2[1] - point1[1]) * (point2[1] - point1[1]);
        return Math.sqrt(dx_sq + dy_sq);
    };

    getFaceWidth = (predictions) => {
        if (predictions.length === 1) {
            const keypoints = predictions[0].scaledMesh;
            return { faceWidth: this.getDistance(keypoints[234], keypoints[454]) };
        }
        return { status: 'error' };
    };
    
    getHeadTiltAngle = (point1, point2) => {
        const dx = (point2[0] - point1[0]);
        const dy = (point2[1] - point1[1]);
        return Math.atan(dy/dx) * 360 / (Math.PI * 2);
    };
    
    getCoordinates = (point) => {
        return [point[0], point[1]];
    };
    
    crop = async (predictions, ctx, width, height) => {
        if (predictions.length === 1) {
            const keypoints = predictions.map((prediction) => {
                this.getPoints(prediction.scaledMesh, width, height).forEach(half => {
                    this.drawPath(ctx, half, true);
                });
                ctx.fillStyle = 'white';
                ctx.fill();
                return prediction.scaledMesh;
            })[0];
            return {
                headTiltAngle: this.getHeadTiltAngle(keypoints[234], keypoints[454]),
                topOfHead: this.getCoordinates(keypoints[10]),
                chin: this.getCoordinates(keypoints[152]),
                leftEyebrow: this.getCoordinates(keypoints[223])
            };
        }
        return { status: 'error' };
    };
    
    checkHeadTiltAngle = (angle) => {
        return angle < 20 && angle > -20;
    };

    isPixelWhite = (data, index) => {
        return data[index] === 255 && data[index + 1] === 255 && data[index + 2] === 255 && data[index + 3] === 255;
    };

    turnPixelTransparent = (imageData) => {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (this.isPixelWhite(data, i)) {
                data[i + 3] = 0;
            }
        }
    };

    generateGenderNeutralAccessoriesArray = (assets) => {
        const genderNeutralAccessoriesArray = [];
        assets.female.forEach((item, index) => {
            genderNeutralAccessoriesArray.push(item);
            if (assets.male[index]) {
                genderNeutralAccessoriesArray.push(assets.male[index]);
            }
        });
        if (assets.female.length < assets.male.length) {
            assets.male.slice(assets.female.length, assets.male.length).forEach(item => {
                genderNeutralAccessoriesArray.push(item);
            });
        }
        return genderNeutralAccessoriesArray;
    };

    insertNullAsset = (assets) => {
        const nullAsset = ApplicationConstants.NULL_ASSETS_CODE;
        Object.keys(assets).forEach(key => {
            assets[key].unshift(nullAsset);
        });
    };

    getPhotoMargin = (scalingRatio) => {
        return 0.5 * Math.abs(1 - scalingRatio) * ApplicationConstants.IMAGE_STYLE.width;
    };

    print = () => {
        window.print();
    };

    isOddNumber = (number) => {
        return number % 2 === 1;
    };

    isEvenNumber = (number) => {
        return number % 2 === 0;
    };

    checkIndex = (index, numberOfAssets, currentIndex, lowerLimit) => {
        return index !== currentIndex && index < numberOfAssets && index >= lowerLimit;
    };

    getRandomCostumeIndex = (numberOfAssets, currentIndex, isNullAssetIncluded) => {
        const lowerLimit = isNullAssetIncluded ? 0 : 1;
        const randomIndex = Math.floor(Math.random() * (numberOfAssets - lowerLimit) + lowerLimit);
        if (!this.checkIndex(randomIndex, numberOfAssets, currentIndex, lowerLimit)) {
            this.getRandomCostumeIndex(numberOfAssets, currentIndex, isNullAssetIncluded);   
        }
        return randomIndex;
    };

    getCostumeIndex = (numberOfAssets, currentIndex, isNullAssetIncluded, index) => {
        return index === undefined ? this.getRandomCostumeIndex(numberOfAssets, currentIndex, isNullAssetIncluded) : index;
    };

    getDownloadImageSize = (dataUrl) => {
        return atob(dataUrl.split('base64,')[1]).length / 1000;
    };
    
    detectVideo = async (webcamRef, canvasRef, setFaceGeometry, net) => {
        if (
            typeof webcamRef.current !== 'undefined' &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            const video = webcamRef.current.video;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const face = await net.estimateFaces(video);
            requestAnimationFrame(() => {
                setFaceGeometry(face, canvas, video.videoWidth);
            });
            this.detectVideo(net);
        }
    };
}

export default Utils;
