import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({ imports: [ConfigModule.forRoot()], providers: [ConfigService], exports: [ConfigService] })
export class EnvConfigModule { }
