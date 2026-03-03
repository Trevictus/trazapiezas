"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Part = void 0;
const typeorm_1 = require("typeorm");
const Movement_1 = require("./Movement");
let Part = class Part {
};
exports.Part = Part;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Part.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Part.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Part.prototype, "brand", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Part.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)("text"),
    __metadata("design:type", String)
], Part.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("decimal", { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Part.prototype, "purchasePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Part.prototype, "stock", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Movement_1.Movement, (movement) => movement.part),
    __metadata("design:type", Array)
], Part.prototype, "movements", void 0);
exports.Part = Part = __decorate([
    (0, typeorm_1.Entity)("parts")
], Part);
