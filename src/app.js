import dotenv from 'dotenv';
import { menuPrincipal } from './commands/menuPrincipal.js';

dotenv.config();

async function main() {
    try {
        await menuPrincipal();
    } catch (error) {
        console.error('Error fatal:', error);
        process.exit(1);
    }
}

main();