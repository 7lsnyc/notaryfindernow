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
var dotenv_1 = require("dotenv");
var path_1 = require("path");
// Load environment variables from .env
(0, dotenv_1.config)({ path: (0, path_1.resolve)(process.cwd(), '.env') });
var google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
var supabase_js_1 = require("../lib/supabase.js");
var supabase_js_2 = require("../lib/supabase.js");
var promises_1 = require("timers/promises");
var fs = require("fs/promises");
// Initialize Google Maps client
var client = new google_maps_services_js_1.Client({});
// Configuration
var CONFIG = {
    SEARCH_RADIUS_METERS: 50000, // 50km ~ 31 miles
    MIN_RATING: 0, // Accept unrated notaries, we'll mark them as "New"
    MIN_REVIEWS: 0, // Accept notaries without reviews yet
    REQUESTS_PER_SECOND: 10, // Rate limiting
    CHECKPOINT_FILE: './tier1_notaries_progress.json',
    KEYWORDS: [
        'mobile notary',
        '24 hour notary',
        '24/7 notary',
        'free notary',
        'bank notary',
        'library notary',
        'remote notary',
        'online notary',
        'ron capable',
        'remote online notarization',
        'traveling notary',
        'notary signing agent',
        'loan signing',
        'notario publico' // Add Spanish term to catch Hispanic community notaries
    ],
    INITIAL_CITY: {
        name: 'Los Angeles',
        state: 'CA',
        coordinates: {
            lat: 34.0522,
            lng: -118.2437
        }
    }
};
// Track API usage
var apiCreditsUsed = 0;
// Helper to detect specialized services from place details
function detectSpecializedServices(place) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var services = [];
    var textToSearch = [
        ((_a = place.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '',
        ((_c = (_b = place.editorial_summary) === null || _b === void 0 ? void 0 : _b.overview) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '',
        ((_e = (_d = place.reviews) === null || _d === void 0 ? void 0 : _d.map(function (r) { var _a; return (_a = r.text) === null || _a === void 0 ? void 0 : _a.toLowerCase(); })) === null || _e === void 0 ? void 0 : _e.join(' ')) || '',
        ((_g = (_f = place.types) === null || _f === void 0 ? void 0 : _f.join(' ')) === null || _g === void 0 ? void 0 : _g.toLowerCase()) || ''
    ].join(' ');
    // Check for mobile notary
    if (textToSearch.includes('mobile notary') ||
        textToSearch.includes('traveling notary') ||
        textToSearch.includes('on-site notary')) {
        services.push('mobile_notary');
    }
    // Check for 24-hour service
    if (textToSearch.includes('24 hour') ||
        textToSearch.includes('24/7') ||
        textToSearch.includes('available anytime') ||
        ((_j = (_h = place.opening_hours) === null || _h === void 0 ? void 0 : _h.periods) === null || _j === void 0 ? void 0 : _j.some(function (period) {
            return period.open.time === '0000' && period.close.time === '2359';
        }))) {
        services.push('24_hour');
    }
    // Check for free service
    if (textToSearch.includes('free notary') ||
        textToSearch.includes('no charge') ||
        textToSearch.includes('complimentary notary') ||
        ((_k = place.types) === null || _k === void 0 ? void 0 : _k.some(function (type) { return ['bank', 'library'].includes(type); }))) {
        services.push('free_service');
    }
    // Check for remote notary service
    var remote_states = [];
    if (textToSearch.includes('remote notary') ||
        textToSearch.includes('online notary') ||
        textToSearch.includes('ron capable') ||
        textToSearch.includes('remote online notarization')) {
        services.push('remote_notary');
        // If we detect remote notary service, check which states they might serve
        // First, add their home state if it supports RON
        var stateMatch = (_l = place.formatted_address) === null || _l === void 0 ? void 0 : _l.match(/[A-Z]{2}(?=\s+\d{5}(?:-\d{4})?$)/);
        if (stateMatch && supabase_js_2.REMOTE_NOTARY_STATES.includes(stateMatch[0])) {
            remote_states.push(stateMatch[0]);
        }
        // Look for other state abbreviations in the text
        var stateRegex = /\b[A-Z]{2}\b/g;
        var foundStates = textToSearch.match(stateRegex) || [];
        foundStates.forEach(function (state) {
            if (supabase_js_2.REMOTE_NOTARY_STATES.includes(state) && !remote_states.includes(state)) {
                remote_states.push(state);
            }
        });
    }
    // Check for online booking capability
    var accepts_online_booking = textToSearch.includes('book online') ||
        textToSearch.includes('schedule online') ||
        textToSearch.includes('book now') ||
        textToSearch.includes('book appointment') ||
        ((_o = (_m = place.types) === null || _m === void 0 ? void 0 : _m.includes('accepts_reservations')) !== null && _o !== void 0 ? _o : false);
    // If no services detected, default to mobile notary
    if (services.length === 0) {
        services.push('mobile_notary');
    }
    return { services: services, remote_states: remote_states, accepts_online_booking: accepts_online_booking };
}
// Helper to format business hours
function formatBusinessHours(hours) {
    // Default hours if none provided
    var defaultHours = {
        monday: 'By appointment',
        tuesday: 'By appointment',
        wednesday: 'By appointment',
        thursday: 'By appointment',
        friday: 'By appointment',
        saturday: 'By appointment',
        sunday: 'By appointment'
    };
    if (!(hours === null || hours === void 0 ? void 0 : hours.periods))
        return defaultHours;
    var daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    var formattedHours = {};
    try {
        hours.periods.forEach(function (period) {
            var _a, _b;
            if (!((_a = period === null || period === void 0 ? void 0 : period.open) === null || _a === void 0 ? void 0 : _a.time) || !((_b = period === null || period === void 0 ? void 0 : period.close) === null || _b === void 0 ? void 0 : _b.time))
                return;
            var day = daysOfWeek[period.open.day];
            if (period.open.time === '0000' && period.close.time === '2359') {
                formattedHours[day] = '24 hours';
            }
            else {
                var openTime = period.open.time.slice(0, 2) + ':' + period.open.time.slice(2);
                var closeTime = period.close.time.slice(0, 2) + ':' + period.close.time.slice(2);
                formattedHours[day] = "".concat(openTime, " - ").concat(closeTime);
            }
        });
        // Fill in missing days with 'Closed'
        daysOfWeek.forEach(function (day) {
            if (!formattedHours[day]) {
                formattedHours[day] = 'Closed';
            }
        });
        return formattedHours;
    }
    catch (error) {
        console.error('Error formatting business hours:', error);
        return defaultHours;
    }
}
// Helper to check current availability
function checkCurrentAvailability(hours) {
    if (!(hours === null || hours === void 0 ? void 0 : hours.periods))
        return false;
    var now = new Date();
    var currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    var currentTime = now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0');
    return hours.periods.some(function (period) {
        var _a, _b;
        if (!((_a = period.open) === null || _a === void 0 ? void 0 : _a.time) || !((_b = period.close) === null || _b === void 0 ? void 0 : _b.time))
            return false;
        if (period.open.day !== currentDay)
            return false;
        return period.open.time <= currentTime && period.close.time >= currentTime;
    });
}
// Helper to extract pricing information
function extractPricingInfo(place) {
    var _a, _b, _c, _d;
    var textToSearch = [
        ((_b = (_a = place.editorial_summary) === null || _a === void 0 ? void 0 : _a.overview) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '',
        ((_d = (_c = place.reviews) === null || _c === void 0 ? void 0 : _c.map(function (r) { var _a; return (_a = r.text) === null || _a === void 0 ? void 0 : _a.toLowerCase(); })) === null || _d === void 0 ? void 0 : _d.join(' ')) || ''
    ].join(' ');
    // Look for price mentions
    var priceMatch = textToSearch.match(/\$(\d+)/);
    var starting_price = priceMatch ? parseInt(priceMatch[1]) : undefined;
    // Look for pricing information
    var price_info = starting_price ?
        "Starting at $".concat(starting_price) :
        'Contact for pricing';
    return { starting_price: starting_price, price_info: price_info };
}
// Helper to detect business type
function detectBusinessType(place) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var types = [];
    var textToSearch = [
        ((_a = place.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '',
        ((_c = (_b = place.editorial_summary) === null || _b === void 0 ? void 0 : _b.overview) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '',
        ((_e = (_d = place.types) === null || _d === void 0 ? void 0 : _d.join(' ')) === null || _e === void 0 ? void 0 : _e.toLowerCase()) || ''
    ].join(' ');
    if (((_f = place.types) === null || _f === void 0 ? void 0 : _f.includes('post_office')) || textToSearch.includes('ups store') || textToSearch.includes('shipping')) {
        types.push('shipping_store');
    }
    if (((_g = place.types) === null || _g === void 0 ? void 0 : _g.includes('bank')) || textToSearch.includes('bank')) {
        types.push('bank');
    }
    if (((_h = place.types) === null || _h === void 0 ? void 0 : _h.includes('library')) || textToSearch.includes('library')) {
        types.push('library');
    }
    if (textToSearch.includes('law') || textToSearch.includes('attorney') || textToSearch.includes('legal')) {
        types.push('law_office');
    }
    if (textToSearch.includes('title company') || textToSearch.includes('escrow')) {
        types.push('title_company');
    }
    if (types.length === 0) {
        types.push('independent');
    }
    return types;
}
// Helper to detect service radius and areas
function detectServiceInfo(place) {
    var _a, _b, _c, _d, _e;
    var areas = [];
    var radius;
    var textToSearch = [
        ((_a = place.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '',
        ((_c = (_b = place.editorial_summary) === null || _b === void 0 ? void 0 : _b.overview) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '',
        ((_e = (_d = place.reviews) === null || _d === void 0 ? void 0 : _d.map(function (r) { var _a; return (_a = r.text) === null || _a === void 0 ? void 0 : _a.toLowerCase(); })) === null || _e === void 0 ? void 0 : _e.join(' ')) || ''
    ].join(' ');
    // Look for mile radius mentions
    var radiusMatch = textToSearch.match(/(\d+)\s*mile/);
    if (radiusMatch) {
        radius = parseInt(radiusMatch[1]);
    }
    // Look for area mentions
    var areaMatches = textToSearch.match(/serving\s+([^,.]+)/g);
    if (areaMatches) {
        areaMatches.forEach(function (match) {
            var area = match.replace('serving', '').trim();
            if (area)
                areas.push(area);
        });
    }
    return { radius: radius, areas: areas };
}
// Helper to detect languages
function detectLanguages(place) {
    var _a, _b, _c, _d, _e;
    var languages = new Set(['English']);
    var textToSearch = [
        ((_a = place.name) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '',
        ((_c = (_b = place.editorial_summary) === null || _b === void 0 ? void 0 : _b.overview) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '',
        ((_e = (_d = place.reviews) === null || _d === void 0 ? void 0 : _d.map(function (r) { var _a; return (_a = r.text) === null || _a === void 0 ? void 0 : _a.toLowerCase(); })) === null || _e === void 0 ? void 0 : _e.join(' ')) || ''
    ].join(' ');
    if (textToSearch.includes('español') ||
        textToSearch.includes('espanol') ||
        textToSearch.includes('spanish') ||
        textToSearch.includes('hablo') ||
        textToSearch.includes('notario')) {
        languages.add('Spanish');
    }
    if (textToSearch.includes('mandarin') || textToSearch.includes('chinese')) {
        languages.add('Mandarin');
    }
    if (textToSearch.includes('vietnamese')) {
        languages.add('Vietnamese');
    }
    if (textToSearch.includes('korean')) {
        languages.add('Korean');
    }
    if (textToSearch.includes('tagalog') || textToSearch.includes('filipino')) {
        languages.add('Tagalog');
    }
    return Array.from(languages);
}
// Main function to fetch tier 1 notaries
function fetchTier1Notaries() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, lastState, lastCity, processedIds, startFromState, startFromCity, _i, _b, _c, state, cities, _loop_1, _d, cities_1, city, state_1;
        var _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0: return [4 /*yield*/, loadProgress()];
                case 1:
                    _a = _o.sent(), lastState = _a.lastState, lastCity = _a.lastCity, processedIds = _a.processedIds;
                    startFromState = !lastState;
                    startFromCity = !lastCity;
                    console.log('Starting nationwide notary fetch...');
                    console.log('API credits budget: $300');
                    _i = 0, _b = Object.entries(supabase_js_2.MAJOR_CITIES_BY_STATE);
                    _o.label = 2;
                case 2:
                    if (!(_i < _b.length)) return [3 /*break*/, 7];
                    _c = _b[_i], state = _c[0], cities = _c[1];
                    if (lastState && !startFromState) {
                        if (state === lastState)
                            startFromState = true;
                        else
                            return [3 /*break*/, 6];
                    }
                    console.log("\nProcessing state: ".concat(state));
                    _loop_1 = function (city) {
                        var searchQueries, allPlaces_1, _p, searchQueries_1, query, searchResponse, searchData, candidates, _q, candidates_1, candidate, placeId, place, _r, services, remote_states, accepts_online_booking, _s, starting_price, price_info, is_available_now, business_type, _t, service_radius_miles, service_areas, languages, _u, street, cityState, rest, zip, notaryData, error, error_1;
                        return __generator(this, function (_v) {
                            switch (_v.label) {
                                case 0:
                                    if (lastCity && !startFromCity) {
                                        if (city.name === lastCity)
                                            startFromCity = true;
                                        else
                                            return [2 /*return*/, "continue"];
                                    }
                                    console.log("\nProcessing ".concat(city.name, ", ").concat(state, "..."));
                                    _v.label = 1;
                                case 1:
                                    _v.trys.push([1, 15, , 17]);
                                    searchQueries = [
                                        "mobile notary service in ".concat(city.name, ", ").concat(supabase_js_2.STATE_ABBREVIATIONS[state]),
                                        "notary public in ".concat(city.name, ", ").concat(supabase_js_2.STATE_ABBREVIATIONS[state]),
                                        "notario publico en ".concat(city.name, ", ").concat(supabase_js_2.STATE_ABBREVIATIONS[state]),
                                        "24 hour notary in ".concat(city.name, ", ").concat(supabase_js_2.STATE_ABBREVIATIONS[state])
                                    ];
                                    allPlaces_1 = new Set();
                                    _p = 0, searchQueries_1 = searchQueries;
                                    _v.label = 2;
                                case 2:
                                    if (!(_p < searchQueries_1.length)) return [3 /*break*/, 7];
                                    query = searchQueries_1[_p];
                                    return [4 /*yield*/, fetch("https://places.googleapis.com/v1/places:searchText", {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'X-Goog-Api-Key': process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '',
                                                'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.editorialSummary,places.currentOpeningHours,places.types'
                                            },
                                            body: JSON.stringify({
                                                textQuery: query,
                                                locationBias: {
                                                    circle: {
                                                        center: {
                                                            latitude: city.latitude,
                                                            longitude: city.longitude
                                                        },
                                                        radius: CONFIG.SEARCH_RADIUS_METERS
                                                    }
                                                },
                                                maxResultCount: 20
                                            })
                                        })];
                                case 3:
                                    searchResponse = _v.sent();
                                    return [4 /*yield*/, searchResponse.json()];
                                case 4:
                                    searchData = _v.sent();
                                    apiCreditsUsed++;
                                    if (searchData.places) {
                                        searchData.places.forEach(function (place) {
                                            if (place.id)
                                                allPlaces_1.add(place);
                                        });
                                    }
                                    // Rate limiting between queries
                                    return [4 /*yield*/, (0, promises_1.setTimeout)(1000 / CONFIG.REQUESTS_PER_SECOND)];
                                case 5:
                                    // Rate limiting between queries
                                    _v.sent();
                                    _v.label = 6;
                                case 6:
                                    _p++;
                                    return [3 /*break*/, 2];
                                case 7:
                                    if (allPlaces_1.size === 0) {
                                        console.log('No results found');
                                        return [2 /*return*/, "continue"];
                                    }
                                    console.log("Found ".concat(allPlaces_1.size, " total results"));
                                    candidates = Array.from(allPlaces_1).filter(function (place) {
                                        return place.id && !processedIds.has(place.id);
                                    });
                                    console.log("".concat(candidates.length, " new candidates to process"));
                                    _q = 0, candidates_1 = candidates;
                                    _v.label = 8;
                                case 8:
                                    if (!(_q < candidates_1.length)) return [3 /*break*/, 14];
                                    candidate = candidates_1[_q];
                                    return [4 /*yield*/, (0, promises_1.setTimeout)(1000 / CONFIG.REQUESTS_PER_SECOND)];
                                case 9:
                                    _v.sent();
                                    placeId = candidate.id;
                                    if (!placeId || processedIds.has(placeId))
                                        return [3 /*break*/, 13];
                                    place = {
                                        place_id: candidate.id,
                                        name: candidate.displayName.text,
                                        formatted_address: candidate.formattedAddress,
                                        geometry: {
                                            location: {
                                                lat: (_f = (_e = candidate.location) === null || _e === void 0 ? void 0 : _e.latitude) !== null && _f !== void 0 ? _f : city.latitude,
                                                lng: (_h = (_g = candidate.location) === null || _g === void 0 ? void 0 : _g.longitude) !== null && _h !== void 0 ? _h : city.longitude
                                            }
                                        },
                                        rating: (_j = candidate.rating) !== null && _j !== void 0 ? _j : 0,
                                        user_ratings_total: (_k = candidate.userRatingCount) !== null && _k !== void 0 ? _k : 0,
                                        editorial_summary: candidate.editorialSummary ? { overview: candidate.editorialSummary.text } : undefined,
                                        opening_hours: {
                                            periods: (_l = candidate.currentOpeningHours) === null || _l === void 0 ? void 0 : _l.periods
                                        },
                                        types: candidate.types
                                    };
                                    _r = detectSpecializedServices(place), services = _r.services, remote_states = _r.remote_states, accepts_online_booking = _r.accepts_online_booking;
                                    _s = extractPricingInfo(place), starting_price = _s.starting_price, price_info = _s.price_info;
                                    is_available_now = checkCurrentAvailability(place.opening_hours);
                                    business_type = detectBusinessType(place);
                                    _t = detectServiceInfo(place), service_radius_miles = _t.radius, service_areas = _t.areas;
                                    languages = detectLanguages(place);
                                    if (!place.formatted_address) return [3 /*break*/, 11];
                                    _u = place.formatted_address.split(','), street = _u[0], cityState = _u[1], rest = _u.slice(2);
                                    zip = rest.join('').replace(/\D/g, '');
                                    notaryData = {
                                        place_id: place.place_id,
                                        created_at: new Date().toISOString(),
                                        name: place.name,
                                        address: street.trim(),
                                        city: city.name,
                                        state: supabase_js_2.STATE_ABBREVIATIONS[state],
                                        zip: zip,
                                        latitude: place.geometry.location.lat,
                                        longitude: place.geometry.location.lng,
                                        business_hours: formatBusinessHours(place.opening_hours),
                                        services: ['mobile_notary'],
                                        languages: languages,
                                        certifications: ["".concat(state, " Notary Public")],
                                        about: ((_m = place.editorial_summary) === null || _m === void 0 ? void 0 : _m.overview) || "".concat(place.name, " is a notary service in ").concat(city.name, "."),
                                        pricing: {
                                            starting_price: starting_price,
                                            price_info: price_info,
                                        },
                                        rating: place.rating,
                                        review_count: place.user_ratings_total,
                                        specialized_services: services,
                                        is_available_now: is_available_now,
                                        accepts_online_booking: accepts_online_booking,
                                        remote_notary_states: remote_states.length > 0 ? remote_states : undefined,
                                        business_type: business_type,
                                        service_radius_miles: service_radius_miles,
                                        service_areas: service_areas.length > 0 ? service_areas : undefined
                                    };
                                    return [4 /*yield*/, supabase_js_1.supabase
                                            .from('notaries')
                                            .upsert(notaryData, { onConflict: 'id' })];
                                case 10:
                                    error = (_v.sent()).error;
                                    if (error) {
                                        console.error("Error saving notary ".concat(place.name, ":"), error);
                                    }
                                    else {
                                        console.log("Saved notary: ".concat(place.name, " (").concat(services.join(', '), ")"));
                                    }
                                    _v.label = 11;
                                case 11:
                                    processedIds.add(placeId);
                                    return [4 /*yield*/, saveProgress(state, city.name, processedIds)];
                                case 12:
                                    _v.sent();
                                    if (apiCreditsUsed * 0.02 > 250) {
                                        console.log('\nApproaching API credit limit. Stopping...');
                                        return [2 /*return*/, { value: void 0 }];
                                    }
                                    _v.label = 13;
                                case 13:
                                    _q++;
                                    return [3 /*break*/, 8];
                                case 14: return [3 /*break*/, 17];
                                case 15:
                                    error_1 = _v.sent();
                                    console.error("Error processing ".concat(city.name, ", ").concat(state, ":"), error_1);
                                    return [4 /*yield*/, saveProgress(state, city.name, processedIds)];
                                case 16:
                                    _v.sent();
                                    throw error_1;
                                case 17: return [2 /*return*/];
                            }
                        });
                    };
                    _d = 0, cities_1 = cities;
                    _o.label = 3;
                case 3:
                    if (!(_d < cities_1.length)) return [3 /*break*/, 6];
                    city = cities_1[_d];
                    return [5 /*yield**/, _loop_1(city)];
                case 4:
                    state_1 = _o.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _o.label = 5;
                case 5:
                    _d++;
                    return [3 /*break*/, 3];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    console.log('\nFetch complete!');
                    console.log("API credits used: ".concat(apiCreditsUsed, " (approximately $").concat((apiCreditsUsed * 0.02).toFixed(2), ")"));
                    return [2 /*return*/];
            }
        });
    });
}
// Updated save progress function
function saveProgress(state, city, processedIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.writeFile(CONFIG.CHECKPOINT_FILE, JSON.stringify({
                        lastState: state,
                        lastCity: city,
                        processedIds: Array.from(processedIds)
                    }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Updated load progress function
function loadProgress() {
    return __awaiter(this, void 0, void 0, function () {
        var data, _a, lastState, lastCity, processedIds, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.readFile(CONFIG.CHECKPOINT_FILE, 'utf-8')];
                case 1:
                    data = _c.sent();
                    _a = JSON.parse(data), lastState = _a.lastState, lastCity = _a.lastCity, processedIds = _a.processedIds;
                    return [2 /*return*/, { lastState: lastState, lastCity: lastCity, processedIds: new Set(processedIds) }];
                case 2:
                    _b = _c.sent();
                    return [2 /*return*/, { processedIds: new Set() }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Run the main script
fetchTier1Notaries().catch(console.error);
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, name_1, state, coordinates, notaries, error, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Starting notary search...');
                    console.log('API Credits Budget: $300');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    _a = CONFIG.INITIAL_CITY, name_1 = _a.name, state = _a.state, coordinates = _a.coordinates;
                    console.log("Searching in ".concat(name_1, ", ").concat(state, "..."));
                    return [4 /*yield*/, searchNotariesInCity(name_1, state, coordinates.lat, coordinates.lng)];
                case 2:
                    notaries = _b.sent();
                    if (!(notaries.length > 0)) return [3 /*break*/, 4];
                    console.log("Found ".concat(notaries.length, " notaries in ").concat(name_1, ", ").concat(state));
                    return [4 /*yield*/, supabase_js_1.supabase
                            .from('notaries')
                            .upsert(notaries, { onConflict: 'place_id' })];
                case 3:
                    error = (_b.sent()).error;
                    if (error) {
                        console.error('Error inserting notaries:', error);
                    }
                    else {
                        console.log("Successfully inserted ".concat(notaries.length, " notaries"));
                    }
                    return [3 /*break*/, 5];
                case 4:
                    console.log("No notaries found in ".concat(name_1, ", ").concat(state));
                    _b.label = 5;
                case 5:
                    console.log("API Credits Used: ".concat(apiCreditsUsed));
                    console.log("Approximate Cost: $".concat((apiCreditsUsed * 0.02).toFixed(2)));
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _b.sent();
                    console.error('Error in main function:', error_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function searchNotariesInCity(city, state, lat, lng) {
    return __awaiter(this, void 0, void 0, function () {
        var notaries, processedPlaceIds, apiKey, _i, _a, keyword, searchQuery, response, _b, _c, place, detailsResponse, placeDetails, _d, services, remote_states, accepts_online_booking, businessHours, isAvailableNow, _e, starting_price, price_info, businessType, _f, service_radius_miles, service_areas, languages, _g, street, cityState, rest, zip, notaryData, error_3;
        var _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    notaries = [];
                    processedPlaceIds = new Set();
                    apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
                    if (!apiKey) {
                        throw new Error('Google Places API key is not configured');
                    }
                    _i = 0, _a = CONFIG.KEYWORDS;
                    _k.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                    keyword = _a[_i];
                    _k.label = 2;
                case 2:
                    _k.trys.push([2, 9, , 10]);
                    searchQuery = "".concat(keyword, " in ").concat(city, ", ").concat(state);
                    console.log("Searching for: ".concat(searchQuery));
                    return [4 /*yield*/, client.textSearch({
                            params: {
                                query: searchQuery,
                                location: { lat: lat, lng: lng },
                                radius: CONFIG.SEARCH_RADIUS_METERS,
                                key: apiKey
                            }
                        })];
                case 3:
                    response = _k.sent();
                    apiCreditsUsed += 1; // Text Search costs 1 credit
                    if (!response.data.results) return [3 /*break*/, 7];
                    _b = 0, _c = response.data.results;
                    _k.label = 4;
                case 4:
                    if (!(_b < _c.length)) return [3 /*break*/, 7];
                    place = _c[_b];
                    if (!place.place_id)
                        return [3 /*break*/, 6];
                    if (processedPlaceIds.has(place.place_id))
                        return [3 /*break*/, 6];
                    processedPlaceIds.add(place.place_id);
                    return [4 /*yield*/, client.placeDetails({
                            params: {
                                place_id: place.place_id,
                                fields: [
                                    'name',
                                    'formatted_address',
                                    'geometry',
                                    'rating',
                                    'user_ratings_total',
                                    'editorial_summary',
                                    'reviews',
                                    'opening_hours',
                                    'types'
                                ],
                                key: apiKey
                            }
                        })];
                case 5:
                    detailsResponse = _k.sent();
                    apiCreditsUsed += 1; // Place Details costs 1 credit
                    placeDetails = detailsResponse.data.result;
                    if (!placeDetails || !placeDetails.name || !placeDetails.formatted_address || !((_h = placeDetails.geometry) === null || _h === void 0 ? void 0 : _h.location) || !placeDetails.place_id)
                        return [3 /*break*/, 6];
                    _d = detectSpecializedServices(placeDetails), services = _d.services, remote_states = _d.remote_states, accepts_online_booking = _d.accepts_online_booking;
                    businessHours = formatBusinessHours(placeDetails.opening_hours);
                    isAvailableNow = checkCurrentAvailability(placeDetails.opening_hours);
                    _e = extractPricingInfo(placeDetails), starting_price = _e.starting_price, price_info = _e.price_info;
                    businessType = detectBusinessType(placeDetails);
                    _f = detectServiceInfo(placeDetails), service_radius_miles = _f.radius, service_areas = _f.areas;
                    languages = detectLanguages(placeDetails);
                    _g = placeDetails.formatted_address.split(','), street = _g[0], cityState = _g[1], rest = _g.slice(2);
                    zip = rest.join('').replace(/\D/g, '');
                    notaryData = {
                        place_id: placeDetails.place_id,
                        created_at: new Date().toISOString(),
                        name: placeDetails.name,
                        address: street.trim(),
                        city: city,
                        state: state,
                        zip: zip,
                        latitude: placeDetails.geometry.location.lat,
                        longitude: placeDetails.geometry.location.lng,
                        business_hours: businessHours,
                        services: ['mobile_notary'],
                        languages: languages,
                        certifications: ["".concat(state, " Notary Public")],
                        about: ((_j = placeDetails.editorial_summary) === null || _j === void 0 ? void 0 : _j.overview) || "".concat(placeDetails.name, " is a notary service in ").concat(city, "."),
                        pricing: {
                            starting_price: starting_price,
                            price_info: price_info
                        },
                        rating: placeDetails.rating || 0,
                        review_count: placeDetails.user_ratings_total || 0,
                        specialized_services: services,
                        is_available_now: isAvailableNow,
                        accepts_online_booking: accepts_online_booking,
                        remote_notary_states: remote_states.length > 0 ? remote_states : undefined,
                        business_type: businessType,
                        service_radius_miles: service_radius_miles,
                        service_areas: service_areas.length > 0 ? service_areas : undefined
                    };
                    notaries.push(notaryData);
                    _k.label = 6;
                case 6:
                    _b++;
                    return [3 /*break*/, 4];
                case 7: 
                // Rate limiting
                return [4 /*yield*/, (0, promises_1.setTimeout)(1000 / CONFIG.REQUESTS_PER_SECOND)];
                case 8:
                    // Rate limiting
                    _k.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_3 = _k.sent();
                    console.error("Error searching for \"".concat(keyword, "\":"), error_3);
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 1];
                case 11: return [2 /*return*/, notaries];
            }
        });
    });
}
// Call main function
main();
