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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
/**
 * auth.controller.ts — the two public (unauthenticated) endpoints of the API.
 */
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const auth_service_1 = require("./auth.service");
class SendOtpDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SendOtpDto.prototype, "phone", void 0);
class VerifyOtpDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(4, 8),
    __metadata("design:type", String)
], VerifyOtpDto.prototype, "token", void 0);
let AuthController = class AuthController {
    constructor(auth) {
        this.auth = auth;
    }
    /** Screen 1/2: "Sign in" button -> send the OTP. */
    sendOtp(dto) {
        return this.auth.sendOtp(dto.phone);
    }
    /** Screen 3: "Verify OTP" button -> verify and create a session. */
    verifyOtp(dto) {
        return this.auth.verifyOtp(dto.phone, dto.token);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('send-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendOtpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "sendOtp", null);
__decorate([
    (0, common_1.Post)('verify-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyOtpDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "verifyOtp", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map