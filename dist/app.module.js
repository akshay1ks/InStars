"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
/**
 * app.module.ts — root module.
 *
 * Wires together:
 *  - ConfigModule: loads .env (locally) / Railway variables (in production).
 *  - TypeOrmModule: connects to the Supabase Postgres database using the
 *    "Direct connection" string (DATABASE_URL).
 *  - Feature modules: Auth (OTP login), Users (profile), Matches
 *    (compatible profiles), Chats (messaging + reveal profile).
 */
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const matches_module_1 = require("./matches/matches.module");
const chats_module_1 = require("./chats/chats.module");
const user_entity_1 = require("./users/user.entity");
const chat_entity_1 = require("./chats/chat.entity");
const message_entity_1 = require("./chats/message.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            // isGlobal makes ConfigService injectable everywhere without re-importing.
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            // Database connection. We use the async factory so the DATABASE_URL is
            // read after the ConfigModule has loaded the environment.
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    url: config.get('DATABASE_URL'),
                    // Supabase requires SSL; rejectUnauthorized=false accepts their
                    // managed certificate chain.
                    ssl: { rejectUnauthorized: false },
                    entities: [user_entity_1.User, chat_entity_1.Chat, message_entity_1.Message],
                    // synchronize=true auto-creates/updates tables from the entities.
                    // Perfect for development. For a serious production launch switch
                    // to TypeORM migrations and set this to false.
                    synchronize: true,
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            matches_module_1.MatchesModule,
            chats_module_1.ChatsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map