const ApplicationConstants = {
    AVATAR_BODY_POSITION_ADJUSTMENT: [0, 7],
    AVATAR_TOP_POSITION: 40,
    AVATAR_FACE_WIDTH: 80,
    NULL_ASSETS_CODE: '#',
    ASSETS_IMAGE_FOREHEAD_WIDTH: 330,
    ASSETS_IMAGE_WIDTH: 2550,
    ASSETS_IMAGE_DISTANCE_TO_TOP_OF_HEAD: 185,
    ASSETS_IMAGE_DISTANCE_TO_CHIN: 580,
    ASSETS_IMAGE_DISTANCE_TO_LEFT_EYEBROW: 340,
    ASSETS_IMAGE_ADDED_TOP_MARGIN_HAIRS: 450,
    ASSETS_IMAGE_ADDED_TOP_MARGIN_MASKS: 180,
    Z_INDEX_HELM: 101,
    Z_INDEX_HAIR: 100,
    Z_INDEX_MASK: 98,
    Z_INDEX_TOP: 99,
    Z_INDEX_BODY: 89,
    Z_INDEX_CAPE: 88,
    Z_INDEX_HIDDEN: -1,
    IMAGE_STYLE: {
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        top: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        zIndex: 90,
        width: 640
    },
    FACEMESH_SCALE: 1,
    DECREASE_INDEX: '<',
    INCREASE_INDEX: '>',
    GENDER: {
        female: 'female', 
        male: 'male',
        genderNeutral: 'gender neutral', 
    }
};

export default ApplicationConstants;
