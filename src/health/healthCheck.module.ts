import { Module, Global } from '@nestjs/common';
import HealthCheck from './healthCheck';
import { ConfigModule } from '@nestjs/config';


@Module({
    imports: [ConfigModule],
    controllers: [HealthCheck],
})
export class HealthCheckModule {}