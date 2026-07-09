"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
/**
 * current-user.decorator.ts — small convenience decorator.
 *
 * Usage in a controller:  myRoute(@CurrentUser() user: User) { ... }
 * Returns the User entity that JwtStrategy.validate() attached to the request.
 */
const common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)((_data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
//# sourceMappingURL=current-user.decorator.js.map