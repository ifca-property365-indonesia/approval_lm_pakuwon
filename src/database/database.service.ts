import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
    private readonly logger = new Logger(DatabaseService.name);
    
    
    constructor(private dataSource: DataSource) {
        this.logger.log('DatabaseService initialized with DataSource');
    }

    async checkConnection(): Promise<void> {
        try {
            await this.dataSource.initialize();
            this.logger.log('Database connection established successfully.');
        } catch (error) {
            this.logger.error('Failed to connect to the database:', error);
            throw error;
        }
    }
}