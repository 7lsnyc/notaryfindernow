"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REMOTE_NOTARY_STATES = exports.notaryUtils = exports.DEFAULT_COORDINATES = exports.MAJOR_CITIES_BY_STATE = exports.STATE_ABBREVIATIONS = exports.MAJOR_CA_CITIES = exports.supabase = void 0;
var supabase_js_1 = require("@supabase/supabase-js");
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}
exports.supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});
// Major California cities
exports.MAJOR_CA_CITIES = [
    'Los Angeles',
    'San Francisco',
    'San Diego',
    'San Jose',
    'Sacramento',
    'Oakland'
];
// State abbreviation mapping
exports.STATE_ABBREVIATIONS = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
};
exports.MAJOR_CITIES_BY_STATE = {
    'California': [
        { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 },
        { name: 'San Francisco', latitude: 37.7749, longitude: -122.4194 },
        { name: 'San Diego', latitude: 32.7157, longitude: -117.1611 },
        { name: 'San Jose', latitude: 37.3382, longitude: -121.8863 },
        { name: 'Sacramento', latitude: 38.5816, longitude: -121.4944 },
        { name: 'Oakland', latitude: 37.8044, longitude: -122.2712 }
    ],
    'New York': [
        { name: 'New York City', latitude: 40.7128, longitude: -74.0060 },
        { name: 'Buffalo', latitude: 42.8864, longitude: -78.8784 },
        { name: 'Rochester', latitude: 43.1566, longitude: -77.6088 },
        { name: 'Syracuse', latitude: 43.0481, longitude: -76.1474 },
        { name: 'Albany', latitude: 42.6526, longitude: -73.7562 }
    ],
    'Texas': [
        { name: 'Houston', latitude: 29.7604, longitude: -95.3698 },
        { name: 'Dallas', latitude: 32.7767, longitude: -96.7970 },
        { name: 'Austin', latitude: 30.2672, longitude: -97.7431 },
        { name: 'San Antonio', latitude: 29.4241, longitude: -98.4936 },
        { name: 'Fort Worth', latitude: 32.7555, longitude: -97.3308 }
    ],
    'Florida': [
        { name: 'Miami', latitude: 25.7617, longitude: -80.1918 },
        { name: 'Orlando', latitude: 28.5383, longitude: -81.3792 },
        { name: 'Tampa', latitude: 27.9506, longitude: -82.4572 },
        { name: 'Jacksonville', latitude: 30.3322, longitude: -81.6557 }
    ],
    'Illinois': [
        { name: 'Chicago', latitude: 41.8781, longitude: -87.6298 },
        { name: 'Aurora', latitude: 41.7606, longitude: -88.3201 },
        { name: 'Springfield', latitude: 39.7817, longitude: -89.6501 }
    ],
    'Pennsylvania': [
        { name: 'Philadelphia', latitude: 39.9526, longitude: -75.1652 },
        { name: 'Pittsburgh', latitude: 40.4406, longitude: -79.9959 },
        { name: 'Allentown', latitude: 40.6084, longitude: -75.4902 }
    ],
    'Ohio': [
        { name: 'Columbus', latitude: 39.9612, longitude: -82.9988 },
        { name: 'Cleveland', latitude: 41.4993, longitude: -81.6944 },
        { name: 'Cincinnati', latitude: 39.1031, longitude: -84.5120 }
    ],
    'Georgia': [
        { name: 'Atlanta', latitude: 33.7490, longitude: -84.3880 },
        { name: 'Savannah', latitude: 32.0809, longitude: -81.0912 },
        { name: 'Augusta', latitude: 33.4735, longitude: -82.0105 }
    ],
    'Michigan': [
        { name: 'Detroit', latitude: 42.3314, longitude: -83.0458 },
        { name: 'Grand Rapids', latitude: 42.9634, longitude: -85.6681 },
        { name: 'Lansing', latitude: 42.7325, longitude: -84.5555 }
    ],
    'New Jersey': [
        { name: 'Newark', latitude: 40.7357, longitude: -74.1724 },
        { name: 'Jersey City', latitude: 40.7178, longitude: -74.0431 },
        { name: 'Trenton', latitude: 40.2206, longitude: -74.7597 }
    ],
    'Virginia': [
        { name: 'Virginia Beach', latitude: 36.8529, longitude: -75.9780 },
        { name: 'Richmond', latitude: 37.5407, longitude: -77.4360 },
        { name: 'Norfolk', latitude: 36.8508, longitude: -76.2859 }
    ],
    'Washington': [
        { name: 'Seattle', latitude: 47.6062, longitude: -122.3321 },
        { name: 'Spokane', latitude: 47.6587, longitude: -117.4260 },
        { name: 'Tacoma', latitude: 47.2529, longitude: -122.4443 }
    ],
    'Arizona': [
        { name: 'Phoenix', latitude: 33.4484, longitude: -112.0740 },
        { name: 'Tucson', latitude: 32.2226, longitude: -110.9747 },
        { name: 'Mesa', latitude: 33.4152, longitude: -111.8315 }
    ],
    'Massachusetts': [
        { name: 'Boston', latitude: 42.3601, longitude: -71.0589 },
        { name: 'Worcester', latitude: 42.2626, longitude: -71.8023 },
        { name: 'Springfield', latitude: 42.1015, longitude: -72.5898 }
    ],
    'Tennessee': [
        { name: 'Nashville', latitude: 36.1627, longitude: -86.7816 },
        { name: 'Memphis', latitude: 35.1495, longitude: -90.0490 },
        { name: 'Knoxville', latitude: 35.9606, longitude: -83.9207 }
    ],
    'Maryland': [
        { name: 'Baltimore', latitude: 39.2904, longitude: -76.6122 },
        { name: 'Columbia', latitude: 39.2037, longitude: -76.8610 },
        { name: 'Annapolis', latitude: 38.9784, longitude: -76.4922 }
    ],
    'Colorado': [
        { name: 'Denver', latitude: 39.7392, longitude: -104.9903 },
        { name: 'Colorado Springs', latitude: 38.8339, longitude: -104.8214 },
        { name: 'Aurora', latitude: 39.7294, longitude: -104.8319 }
    ],
    'Nevada': [
        { name: 'Las Vegas', latitude: 36.1699, longitude: -115.1398 },
        { name: 'Reno', latitude: 39.5296, longitude: -119.8138 },
        { name: 'Henderson', latitude: 36.0395, longitude: -114.9817 }
    ],
    'Oregon': [
        { name: 'Portland', latitude: 45.5155, longitude: -122.6789 },
        { name: 'Eugene', latitude: 44.0521, longitude: -123.0868 },
        { name: 'Salem', latitude: 44.9429, longitude: -123.0351 }
    ],
    'Alabama': [
        { name: 'Birmingham', latitude: 33.5207, longitude: -86.8025 },
        { name: 'Montgomery', latitude: 32.3792, longitude: -86.3077 },
        { name: 'Mobile', latitude: 30.6954, longitude: -88.0399 },
        { name: 'Huntsville', latitude: 34.7304, longitude: -86.5861 }
    ],
    'Alaska': [
        { name: 'Anchorage', latitude: 61.2181, longitude: -149.9003 },
        { name: 'Fairbanks', latitude: 64.8378, longitude: -147.7164 },
        { name: 'Juneau', latitude: 58.3019, longitude: -134.4197 }
    ],
    'Arkansas': [
        { name: 'Little Rock', latitude: 34.7465, longitude: -92.2896 },
        { name: 'Fort Smith', latitude: 35.3859, longitude: -94.3985 },
        { name: 'Fayetteville', latitude: 36.0622, longitude: -94.1571 }
    ],
    'Connecticut': [
        { name: 'Hartford', latitude: 41.7658, longitude: -72.6734 },
        { name: 'New Haven', latitude: 41.3083, longitude: -72.9279 },
        { name: 'Bridgeport', latitude: 41.1792, longitude: -73.1894 }
    ],
    'Delaware': [
        { name: 'Wilmington', latitude: 39.7447, longitude: -75.5466 },
        { name: 'Dover', latitude: 39.1582, longitude: -75.5244 },
        { name: 'Newark', latitude: 39.6837, longitude: -75.7497 }
    ],
    'Hawaii': [
        { name: 'Honolulu', latitude: 21.3069, longitude: -157.8583 },
        { name: 'Hilo', latitude: 19.7297, longitude: -155.0900 },
        { name: 'Kailua', latitude: 21.4022, longitude: -157.7394 }
    ],
    'Idaho': [
        { name: 'Boise', latitude: 43.6150, longitude: -116.2023 },
        { name: 'Nampa', latitude: 43.5407, longitude: -116.5635 },
        { name: 'Idaho Falls', latitude: 43.4927, longitude: -112.0408 }
    ],
    'Indiana': [
        { name: 'Indianapolis', latitude: 39.7684, longitude: -86.1581 },
        { name: 'Fort Wayne', latitude: 41.0793, longitude: -85.1394 },
        { name: 'Evansville', latitude: 37.9716, longitude: -87.5711 }
    ],
    'Iowa': [
        { name: 'Des Moines', latitude: 41.5868, longitude: -93.6250 },
        { name: 'Cedar Rapids', latitude: 41.9779, longitude: -91.6656 },
        { name: 'Davenport', latitude: 41.5236, longitude: -90.5776 }
    ],
    'Kansas': [
        { name: 'Wichita', latitude: 37.6872, longitude: -97.3301 },
        { name: 'Kansas City', latitude: 39.1147, longitude: -94.6275 },
        { name: 'Topeka', latitude: 39.0473, longitude: -95.6752 }
    ],
    'Kentucky': [
        { name: 'Louisville', latitude: 38.2527, longitude: -85.7585 },
        { name: 'Lexington', latitude: 38.0406, longitude: -84.5037 },
        { name: 'Bowling Green', latitude: 36.9685, longitude: -86.4808 }
    ],
    'Louisiana': [
        { name: 'New Orleans', latitude: 29.9511, longitude: -90.0715 },
        { name: 'Baton Rouge', latitude: 30.4515, longitude: -91.1871 },
        { name: 'Shreveport', latitude: 32.5252, longitude: -93.7502 }
    ],
    'Maine': [
        { name: 'Portland', latitude: 43.6591, longitude: -70.2568 },
        { name: 'Lewiston', latitude: 44.1004, longitude: -70.2148 },
        { name: 'Bangor', latitude: 44.8016, longitude: -68.7712 }
    ],
    'Minnesota': [
        { name: 'Minneapolis', latitude: 44.9778, longitude: -93.2650 },
        { name: 'Saint Paul', latitude: 44.9537, longitude: -93.0900 },
        { name: 'Rochester', latitude: 44.0121, longitude: -92.4802 }
    ],
    'Mississippi': [
        { name: 'Jackson', latitude: 32.2988, longitude: -90.1848 },
        { name: 'Gulfport', latitude: 30.3674, longitude: -89.0928 },
        { name: 'Biloxi', latitude: 30.3960, longitude: -88.8853 }
    ],
    'Missouri': [
        { name: 'Kansas City', latitude: 39.0997, longitude: -94.5786 },
        { name: 'St. Louis', latitude: 38.6270, longitude: -90.1994 },
        { name: 'Springfield', latitude: 37.2090, longitude: -93.2923 }
    ],
    'Montana': [
        { name: 'Billings', latitude: 45.7833, longitude: -108.5007 },
        { name: 'Missoula', latitude: 46.8721, longitude: -113.9940 },
        { name: 'Great Falls', latitude: 47.5052, longitude: -111.2985 }
    ],
    'Nebraska': [
        { name: 'Omaha', latitude: 41.2565, longitude: -95.9345 },
        { name: 'Lincoln', latitude: 40.8136, longitude: -96.7026 },
        { name: 'Bellevue', latitude: 41.1544, longitude: -95.9145 }
    ],
    'New Hampshire': [
        { name: 'Manchester', latitude: 42.9956, longitude: -71.4548 },
        { name: 'Nashua', latitude: 42.7654, longitude: -71.4676 },
        { name: 'Concord', latitude: 43.2081, longitude: -71.5376 }
    ],
    'New Mexico': [
        { name: 'Albuquerque', latitude: 35.0844, longitude: -106.6504 },
        { name: 'Las Cruces', latitude: 32.3199, longitude: -106.7637 },
        { name: 'Santa Fe', latitude: 35.6870, longitude: -105.9378 }
    ],
    'North Carolina': [
        { name: 'Charlotte', latitude: 35.2271, longitude: -80.8431 },
        { name: 'Raleigh', latitude: 35.7796, longitude: -78.6382 },
        { name: 'Greensboro', latitude: 36.0726, longitude: -79.7920 }
    ],
    'North Dakota': [
        { name: 'Fargo', latitude: 46.8772, longitude: -96.7898 },
        { name: 'Bismarck', latitude: 46.8083, longitude: -100.7837 },
        { name: 'Grand Forks', latitude: 47.9253, longitude: -97.0329 }
    ],
    'Oklahoma': [
        { name: 'Oklahoma City', latitude: 35.4676, longitude: -97.5164 },
        { name: 'Tulsa', latitude: 36.1540, longitude: -95.9928 },
        { name: 'Norman', latitude: 35.2226, longitude: -97.4395 }
    ],
    'Rhode Island': [
        { name: 'Providence', latitude: 41.8240, longitude: -71.4128 },
        { name: 'Warwick', latitude: 41.7001, longitude: -71.4162 },
        { name: 'Cranston', latitude: 41.7798, longitude: -71.4373 }
    ],
    'South Carolina': [
        { name: 'Columbia', latitude: 34.0007, longitude: -81.0348 },
        { name: 'Charleston', latitude: 32.7765, longitude: -79.9311 },
        { name: 'Greenville', latitude: 34.8526, longitude: -82.3940 }
    ],
    'South Dakota': [
        { name: 'Sioux Falls', latitude: 43.5446, longitude: -96.7311 },
        { name: 'Rapid City', latitude: 44.0805, longitude: -103.2310 },
        { name: 'Aberdeen', latitude: 45.4647, longitude: -98.4864 }
    ],
    'Utah': [
        { name: 'Salt Lake City', latitude: 40.7608, longitude: -111.8910 },
        { name: 'West Valley City', latitude: 40.6916, longitude: -112.0011 },
        { name: 'Provo', latitude: 40.2338, longitude: -111.6585 }
    ],
    'Vermont': [
        { name: 'Burlington', latitude: 44.4759, longitude: -73.2121 },
        { name: 'South Burlington', latitude: 44.4670, longitude: -73.1710 },
        { name: 'Rutland', latitude: 43.6106, longitude: -72.9726 }
    ],
    'West Virginia': [
        { name: 'Charleston', latitude: 38.3498, longitude: -81.6326 },
        { name: 'Huntington', latitude: 38.4192, longitude: -82.4452 },
        { name: 'Morgantown', latitude: 39.6295, longitude: -79.9559 }
    ],
    'Wisconsin': [
        { name: 'Milwaukee', latitude: 43.0389, longitude: -87.9065 },
        { name: 'Madison', latitude: 43.0731, longitude: -89.4012 },
        { name: 'Green Bay', latitude: 44.5133, longitude: -88.0133 }
    ],
    'Wyoming': [
        { name: 'Cheyenne', latitude: 41.1400, longitude: -104.8202 },
        { name: 'Casper', latitude: 42.8666, longitude: -106.3131 },
        { name: 'Laramie', latitude: 41.3114, longitude: -105.5905 }
    ]
};
// For states not explicitly configured, use these default coordinates (roughly center of US)
exports.DEFAULT_COORDINATES = {
    latitude: 39.8283,
    longitude: -98.5795
};
// Utility functions for notary data
exports.notaryUtils = {
    getNotaryById: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, exports.supabase
                            .from('notaries')
                            .select('*')
                            .eq('id', id)
                            .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    searchTier1Notaries: function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var _c, data, error;
            var latitude = _b.latitude, longitude = _b.longitude, _d = _b.radius, radius = _d === void 0 ? 50 : _d, _e = _b.limit, limit = _e === void 0 ? 20 : _e, businessType = _b.businessType, languages = _b.languages, _f = _b.minRating, minRating = _f === void 0 ? 4.0 : _f, serviceRadiusMiles = _b.serviceRadiusMiles;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, exports.supabase
                            .rpc('search_tier1_notaries', {
                            p_latitude: latitude,
                            p_longitude: longitude,
                            p_radius: radius,
                            p_limit: limit,
                            p_business_type: businessType,
                            p_languages: languages,
                            p_min_rating: minRating,
                            p_service_radius_miles: serviceRadiusMiles
                        })];
                    case 1:
                        _c = _g.sent(), data = _c.data, error = _c.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    getFeaturedTier1Notaries: function (_a) {
        return __awaiter(this, arguments, void 0, function (_b) {
            var _c, data, error;
            var latitude = _b.latitude, longitude = _b.longitude, _d = _b.limit, limit = _d === void 0 ? 3 : _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, exports.supabase
                            .rpc('get_featured_tier1_notaries', {
                            p_latitude: latitude,
                            p_longitude: longitude,
                            p_limit: limit
                        })];
                    case 1:
                        _c = _e.sent(), data = _c.data, error = _c.error;
                        if (error)
                            throw error;
                        return [2 /*return*/, data];
                }
            });
        });
    },
    // Helper function to check if a notary is tier 1
    isTier1Notary: function (notary) {
        return (notary.state === 'CA' &&
            exports.MAJOR_CA_CITIES.includes(notary.city) &&
            notary.rating >= 4.0 &&
            notary.review_count >= 10 &&
            notary.specialized_services.length > 0);
    }
};
// States that allow remote online notarization (RON) as of 2024
exports.REMOTE_NOTARY_STATES = [
    'AK', 'AZ', 'AR', 'CO', 'FL', 'HI', 'ID', 'IA', 'IN', 'KS', 'KY', 'LA', 'MD',
    'MI', 'MN', 'MO', 'MT', 'NE', 'NV', 'NH', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
    'OR', 'PA', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];
