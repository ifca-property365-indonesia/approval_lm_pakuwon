import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '1433', 10),
      username: process.env.DB_USER || 'sa',
      password: process.env.DB_PASS || 'YourStrong!Password',
      database: process.env.DB_NAME || 'MyDatabase',
      autoLoadEntities: true,
      synchronize: false,
      options: {
        encrypt: false, // ubah ke true jika SQL Server pakai SSL
        trustServerCertificate: true, // untuk koneksi lokal
      },
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      await this.dataSource.query('SELECT 1');
      this.logger.log('✅ Database MSSQL connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to MSSQL database:', error.message);
      // jika kamu ingin tetap lanjut startup walau gagal, hapus "throw error;"
      throw error;
    }
  }
}
