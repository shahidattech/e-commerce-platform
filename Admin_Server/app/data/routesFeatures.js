var _ = require('lodash');
var path = require('path');
var featureList = require(path.join(__dirname, 'featureList'));

var routesFeatureList = [
    // Product API
    { route: '/api/v1/product/createproduct', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/product/getProductsByUserId', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/product/deleteProduct', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    //Article API
    { route: '/api/v1/article/createarticle', role: ['Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/article/updatearticle', role: ['Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/artist/createartist', role: ["Admin"] },
    { route: '/api/v1/artist/updateartists', role: ["Admin"] },
    { route: '/api/v1/artwork/createArtwok', role: ["Editor", "Admin"] },
    { route: '/api/v1/artwork/updateArtwork', role: ["Editor", "Admin"] },
    { route: '/api/v1/entityLocation/createEntityLocationProfile', role: ["Editor", "Admin"] },
    { route: '/api/v1/entityLocation/updateVenue', role: ["Editor", "Admin"] },
    { route: '/api/v1/event/createevents', role: ["Editor", "Admin"] },
    { route: '/api/v1/event/updateEvent', role: ["Editor", "Admin"] },
    { route: '/api/v1/slideShow/createSlideShow', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/slideShow/updateSlideshow', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/slideShow/list', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/slideShow/deleteSlideShow', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/tags/addTag', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/homePageConfig/saveHomeConfig', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/homePageConfig/getHomeConfig', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/homePageConfig/saveHomeConfigTheme2', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/homePageConfig/getHomeConfigTheme2', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/product/productSaveCategoryWise', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/slider/createSlider', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/slider/list', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/slider/deleteSlider', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/product/getProductsByProductIdUserId', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/product/updateproduct', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/subscription/getSubscriptionContent', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/subscription/add', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
    { route: '/api/v1/subscription/pay', role: ['user', 'Guest_Editor', "Editor", "Admin"] },
];

exports.getRouteFeature = function (req) {
    return _.find(routesFeatureList, { route: req.route.path }).role;
};
