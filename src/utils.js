export const PERIMETER = [
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

const drawPath = (ctx, points, closePath) => {
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        const point = points[i];
        ctx.lineTo(point[0], point[1]);
    }
    
    if (closePath) {
        ctx.closePath();
    }
};

const getPoints = (keypoints, width) => {
    const points = PERIMETER.map(index => keypoints[index]);
    const leftHalf = points.slice(0, 18);
    const rightHalf = points.slice(17, 37);
    rightHalf.unshift([width, 0, 0], [width, 480, 0]);
    rightHalf.push([0, 0, 0]);
    leftHalf.unshift([0, 480, 0], [0, 0, 0]);
    leftHalf.push([width, 480, 0]);
    return [leftHalf, rightHalf];
};

const distance = (point1, point2) => {
    const dx_sq = (point2[0] - point1[0]) * (point2[0] - point1[0]);
    const dy_sq = (point2[1] - point1[1]) * (point2[1] - point1[1]);
    return Math.sqrt(dx_sq + dy_sq);
};

const polarAngle = (point1, point2) => {
    const dx = (point2[0] - point1[0]);
    const dy = (point2[1] - point1[1]);
    return Math.atan(dy/dx) * Math.PI * 2;
};

export const crop = (predictions, ctx, width) => {
    let result = ['100%', 0];
    if (predictions.length > 0) {
        predictions.forEach((prediction) => {
            const keypoints = prediction.scaledMesh;
            getPoints(keypoints, width).forEach(half => {
                drawPath(ctx, half, true);
            });
            ctx.fillStyle = 'white';
            ctx.fill();
            result = [
                `${distance(keypoints[234], keypoints[454])*0.52}%`,
                polarAngle(keypoints[234], keypoints[454])
            ];
        });
    }
    return result;
};

// Drawing Mesh
// export const drawMesh = (predictions, ctx) => {
//     if (predictions.length > 0) {
//         predictions.forEach((prediction) => {
//             const keypoints = prediction.scaledMesh;

//             //  Draw Triangles
//             for (let i = 0; i < TRIANGULATION.length / 3; i++) {
//                 // Get sets of three keypoints for the triangle
//                 const points = [
//                     TRIANGULATION[i * 3],
//                     TRIANGULATION[i * 3 + 1],
//                     TRIANGULATION[i * 3 + 2],
//                 ].map((index) => keypoints[index]);
//                 //  Draw triangle
//                 drawPath(ctx, points, true);
//             }

//             // Draw Dots
//             for (let i = 0; i < keypoints.length; i++) {
//                 const x = keypoints[i][0];
//                 const y = keypoints[i][1];

//                 ctx.beginPath();
//                 ctx.arc(x, y, 1 /* radius */, 0, 3 * Math.PI);
//                 ctx.fillStyle = "aqua";
//                 ctx.fill();
//             }
//         });
//     }
// };
