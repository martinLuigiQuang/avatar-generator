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
    
    getPoints = (keypoints, width) => {
        const points = this.PERIMETER.map(index => keypoints[index]);
        const leftHalf = points.slice(0, 18);
        const rightHalf = points.slice(17, 37);
        rightHalf.unshift([width, 0, 0], [width, 480, 0]);
        rightHalf.push([0, 0, 0]);
        leftHalf.unshift([0, 480, 0], [0, 0, 0]);
        leftHalf.push([width, 480, 0]);
        return [leftHalf, rightHalf];
    };
    
    getDistance = (point1, point2) => {
        const dx_sq = (point2[0] - point1[0]) * (point2[0] - point1[0]);
        const dy_sq = (point2[1] - point1[1]) * (point2[1] - point1[1]);
        return Math.sqrt(dx_sq + dy_sq);
    };
    
    getHeadTiltAngle = (point1, point2) => {
        const dx = (point2[0] - point1[0]);
        const dy = (point2[1] - point1[1]);
        return Math.atan(dy/dx) * 360 / (Math.PI * 2);
    };
    
    getCoordinates = (point) => {
        return [point[0], point[1]];
    };
    
    crop = (predictions, ctx, width) => {
        let result = [];
        if (predictions.length > 0) {
            predictions.forEach((prediction) => {
                const keypoints = prediction.scaledMesh;
                this.getPoints(keypoints, width).forEach(half => {
                    this.drawPath(ctx, half, true);
                });
                ctx.fillStyle = 'white';
                ctx.fill();
                result = [
                    this.getDistance(keypoints[10], keypoints[152]),
                    this.getDistance(keypoints[234], keypoints[454]),
                    this.getHeadTiltAngle(keypoints[234], keypoints[454]),
                    this.getCoordinates(keypoints[10]),
                    this.getCoordinates(keypoints[152]),
                    this.getCoordinates(keypoints[223])
                ];
            });
        }
        return result;
    };
    
    checkHeadTiltAngle = (angle) => {
        return angle < 20 && angle > -20;
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
