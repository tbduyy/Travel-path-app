"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var updates = [
    {
        name: "Quảng trường Lâm Viên",
        duration: "45 - 60 phút",
        description: "Được coi là \"trái tim\" của thành phố, nơi đây nổi bật với hai công trình kiến trúc bằng kính khổng lồ mang hình dáng nụ hoa Atiso và đóa hoa Dã Quỳ. Đây là điểm check-in không thể bỏ qua, nằm ngay cạnh Hồ Xuân Hương thơ mộng, nơi du khách có thể đi dạo hoặc đạp vịt ngắm cảnh.",
        address: "Đường Trần Quốc Toản, Phường 10, Thành phố Đà Lạt, Lâm Đồng"
    },
    {
        name: "S79 Khai Ngọc Hotel",
        price: "~340.000 VNĐ/đêm",
        address: "Số 79 Khai Ngọc, Phường 10, TP. Đà Lạt, Lâm Đồng",
        metadata: {
            distance: "~700m",
            time: "2 phút",
            note: "Vị trí cực gần trung tâm, phù hợp cho người muốn đi bộ ra quảng trường. Tuy nhiên, vì gần đường lớn nên có thể hơi ồn vào giờ cao điểm."
        }
    },
    {
        name: "Khách sạn Anna Sương",
        price: "~350.000 VNĐ/đêm",
        address: "60 Đường Bà Huyện Thanh Quan, Phường 3, TP. Đà Lạt, Lâm Đồng",
        metadata: {
            distance: "~1.5km",
            time: "5 phút"
        }
    },
    {
        name: "Chợ Đêm Đà Lạt",
        duration: "1 - 2 tiếng",
        description: "Thiên đường ẩm thực đường phố và mua sắm sôi động nhất về đêm tại Đà Lạt. Du khách nhất định phải thử các món đặc sản như bánh tráng nướng, sữa đậu nành nóng, khoai nướng và mua sắm các sản phẩm len thủ công làm quà.",
        address: "Đường Nguyễn Thị Minh Khai, Phường 1, Thành phố Đà Lạt, Lâm Đồng"
    },
    {
        name: "Happy Day 2 Guesthouse",
        price: "~300.000 VNĐ/đêm",
        address: "91 Đường Nguyễn Thị Minh Khai, Phường 1, TP. Đà Lạt, Lâm Đồng",
        metadata: {
            distance: "~150m",
            time: "2p đi bộ",
            note: "Chỉ vài bước chân là đến chợ, cực kỳ tiện lợi để ăn đêm. Nên đặt phòng sớm vì vị trí \"vàng\" này thường nhanh hết chỗ."
        }
    },
    {
        name: "QA Hotel",
        price: "~300.000 VNĐ/đêm",
        address: "08 Nguyễn Thị Minh Khai, Phường 1, TP. Đà Lạt, Lâm Đồng",
        metadata: {
            distance: "~150m",
            time: "2p đi bộ",
            note: "Khu vực này thường kẹt xe vào cuối tuần, khó bắt taxi tận cửa."
        }
    },
    {
        name: "Ga Đà Lạt",
        duration: "60 – 120 phút",
        price: "Vé tham quan: ~ 50.000 VNĐ\nVé tàu: ~ 70 - 150.000 VNĐ",
        description: "Ga Đà Lạt là công trình kiến trúc cổ nổi bật, mang phong cách Pháp kết hợp nét bản địa, gắn liền với lịch sử hình thành và phát triển của thành phố. Không gian hoài cổ với đầu tàu, đường ray và các toa xe cũ là điểm check-in quen thuộc và nơi giúp du khách hiểu thêm về quá khứ Đà Lạt.",
        address: "Số 01 Quang Trung, Phường 10, Thành phố Đà Lạt, Lâm Đồng"
    },
    {
        name: "Winterfell Hotel",
        price: "~210.000 VNĐ/đêm",
        address: "11 Trần Nhật Duật, Phường 8, TP. Đà Lạt, Lâm Đồng",
        metadata: { distance: "~1.7km", time: "5-7 phút" }
    },
    {
        name: "Windy Hill Homestay",
        price: "~250.000 VNĐ/đêm",
        address: "109A Hoàng Hoa Thám, Phường 10, TP. Đà Lạt, Lâm Đồng",
        metadata: {
            distance: "~2km",
            time: "6-8 phút",
            note: "View đồi núi thoáng đãng. Vì là homestay nên không gian sẽ gần gũi, nhưng cần kiểm tra kỹ đường vào vì có thể có dốc cao."
        }
    },
    {
        name: "Quán Lẩu Gà Lá É Tao Ngộ",
        duration: "1 - 1.5 tiếng",
        description: "Quán ăn trứ danh mà bất kỳ du khách nào cũng muốn ghé qua để thưởng thức hương vị lẩu gà ngọt thanh hòa quyện cùng vị cay nồng của ớt hiểm và mùi thơm đặc trưng của lá é. Đây là món ăn cực kỳ phù hợp với không khí se lạnh của phố núi.",
        address: "Số 05 Ba Tháng Tư, Phường 3, Thành phố Đà Lạt, Lâm Đồng",
        type: "RESTAURANT"
    },
    {
        name: "Pontus Hotel",
        price: "~340.000 VNĐ/đêm",
        address: "54 Ba Tháng Tư, Phường 3, TP. Đà Lạt, Lâm Đồng",
        metadata: { distance: "~1.4km", time: "5 phút" }
    },
    {
        name: "The Manor Villas",
        price: "~500.000 VNĐ/đêm",
        address: "03 Đường 3 Tháng 2, Phường 1, TP. Đà Lạt, Lâm Đồng",
        metadata: {
            distance: "~2.5km",
            time: "8-10 phút",
            note: "Phân khúc cao cấp hơn, không gian sang trọng và riêng tư. Phù hợp cho khách muốn nghỉ dưỡng sau khi thưởng thức đặc sản."
        }
    },
    {
        name: "Đồi Chè Cầu Đất",
        duration: "1 - 2 tiếng",
        description: "Không gian xanh mướt của những đồi chè trải dài tận chân trời kết hợp với các trụ điện gió hiện đại tạo nên khung cảnh như châu Âu. Đây cũng là địa điểm săn mây lý tưởng nhất Đà Lạt vào sáng sớm (khoảng 5h30 - 6h30).",
        address: "Thôn Xuân Thọ, Xã Trạm Hành, Thành phố Đà Lạt, Lâm Đồng"
    },
    {
        name: "Rainbow Homestay Cầu Đất",
        price: "~240.000 VNĐ/đêm",
        address: "Xuân Thọ, TP. Đà Lạt, Lâm Đồng",
        metadata: { distance: "~200m", time: "3 phút đi bộ" }
    },
    {
        name: "Mộc Trà Farm",
        price: "~450.000 VNĐ/đêm",
        address: "Thôn Xuân Trường, Xã Trạm Hành, TP. Đà Lạt, Lâm Đồng",
        metadata: { distance: "~4km", time: "10 phút" }
    },
    {
        name: "Khu du lịch Thác Datanla",
        duration: "1 - 2.5 tiếng",
        description: "Điểm đến dành cho những người yêu thích phiêu lưu với hệ thống xe trượt (Alpine Coaster) băng qua rừng thông dài nhất Đông Nam Á. Ngoài ra, du khách còn có thể trải nghiệm đu dây mạo hiểm High Rope Course hoặc ngắm dòng thác đổ hùng vĩ.",
        address: "Quốc lộ 20, Đèo Prenn, Phường 3, Thành phố Đà Lạt, Lâm Đồng"
    },
    {
        name: "Hoàng Gia Trang",
        price: "~500.000 VNĐ/đêm",
        address: "Đường vào Khu du lịch Thác Datanla, Phường 3, TP. Đà Lạt, Lâm Đồng",
        metadata: { distance: "~1.5km", time: "5 phút" }
    },
    {
        name: "Nature Hotel",
        price: "~490.000 VNĐ/đêm",
        address: "112/8 Đường Prenn, Phường 3, TP. Đà Lạt, Lâm Đồng",
        metadata: { distance: "~5km", time: "12-15 phút" }
    },
    {
        name: "Tiệm Cà Phê Túi Mơ To",
        duration: "1 - 1.5 tiếng",
        description: "Một trong những quán cà phê nổi tiếng nhất Đà Lạt với khu vườn cúc họa mi trắng muốt và ngôi nhà gỗ phong cách vintage. Quán nằm trên đồi cao, mang đến tầm nhìn bao trọn thung lũng và những nhà lồng trồng hoa lung linh về đêm.",
        address: "Hẻm 31 Sào Nam, Phường 11, Thành phố Đà Lạt, Lâm Đồng",
        type: "RESTAURANT"
    },
    {
        name: "Mây Bách Đà Lạt",
        price: "~480.000 VNĐ/đêm",
        address: "106 Đường Túi Mơ To, Phường 11, TP. Đà Lạt, Lâm Đồng",
        metadata: { distance: "~1.3km", time: "5 phút" }
    },
    {
        name: "Lê Homestay",
        price: "~350.000 VNĐ/đêm",
        address: "112/2 Đường Túi Mơ To, Phường 11, TP. Đà Lạt, Lâm Đồng",
        metadata: { distance: "~1.5km", time: "6-8 phút" }
    },
    {
        name: "Nhà thờ con gà",
        duration: "30 – 60 phút",
        description: "Nhà thờ Con Gà (Nhà thờ Chính tòa Đà Lạt) là công trình kiến trúc Công giáo tiêu biểu mang phong cách Roman châu Âu, nổi bật với tháp chuông cao và biểu tượng con gà bằng đồng trên đỉnh. Không gian thoáng đãng, cổ kính cùng những ô kính màu đặc trưng tạo nên điểm dừng chân lý tưởng để du khách chiêm ngưỡng kiến trúc, cảm nhận nhịp sống chậm của Đà Lạt và lưu lại những khung hình mang đậm dấu ấn lịch sử.",
        address: "Số 15 Trần Phú, Phường 3, TP. Đà Lạt, Lâm Đồng"
    },
    {
        name: "Hotel Colline",
        price: "~1.690.000 – 2.500.000 VNĐ/đêm",
        address: "10 Phan Bội Châu, Phường Xuân Hương, TP. Đà Lạt, Lâm Đồng",
        description: "Khách sạn 4 sao hiện đại, tiện nghi và sang trọng ngay trung tâm Đà Lạt, chỉ cách những địa điểm nổi tiếng như Chợ Đà Lạt, Hồ Xuân Hương hay Quảng trường Lâm Viên vài phút đi bộ. Phòng ốc được thiết kế tinh tế, trang bị đầy đủ tiện ích, cùng dịch vụ lễ tân 24 giờ, nhà hàng và quầy bar.",
        metadata: { distance: "~1.0km", time: "4-6 phút" }
    }
];
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var dbPlaces, _loop_1, _i, updates_1, update;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.place.findMany({ where: { city: 'Đà Lạt' } })];
                case 1:
                    dbPlaces = _a.sent();
                    _loop_1 = function (update) {
                        var matches, dbPlace, metadata, payload;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    matches = dbPlaces.filter(function (p) {
                                        return p.name.toLowerCase().includes(update.name.toLowerCase()) ||
                                            update.name.toLowerCase().includes(p.name.toLowerCase());
                                    });
                                    if (!(matches.length > 0)) return [3 /*break*/, 2];
                                    dbPlace = matches[0];
                                    metadata = update.metadata ? __assign(__assign({}, (dbPlace.metadata || {})), update.metadata) : dbPlace.metadata;
                                    payload = {
                                        description: update.description || dbPlace.description,
                                        address: update.address || dbPlace.address,
                                        metadata: metadata
                                    };
                                    if (update.price)
                                        payload.price = update.price;
                                    if (update.duration)
                                        payload.duration = update.duration;
                                    if (update.type)
                                        payload.type = update.type;
                                    return [4 /*yield*/, prisma.place.update({
                                            where: { id: dbPlace.id },
                                            data: payload
                                        })];
                                case 1:
                                    _b.sent();
                                    console.log("\u2705 Updated ".concat(dbPlace.name, " (ID: ").concat(dbPlace.id, ")"));
                                    return [3 /*break*/, 3];
                                case 2:
                                    console.log("\u274C Could NOT find in DB: ".concat(update.name));
                                    _b.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, updates_1 = updates;
                    _a.label = 2;
                case 2:
                    if (!(_i < updates_1.length)) return [3 /*break*/, 5];
                    update = updates_1[_i];
                    return [5 /*yield**/, _loop_1(update)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
run().then(function () { return console.log('Done'); }).catch(console.error);
