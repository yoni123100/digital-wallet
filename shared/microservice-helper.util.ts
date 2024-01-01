import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

export class MicroserviceUtil {
  constructor(private readonly clientProxy: ClientProxy) {}

  async send(pattern: string, data?: any) {
    try {
      const result = await firstValueFrom(this.clientProxy.send(pattern, data));

      return result;
    } catch (error) {
      console.error('[MicroserviceUtil] Cannot not finish send operations');
      throw error;
    }
  }

  async emit(pattern: string, data?: any) {
    this.clientProxy.emit(pattern, data);
  }
}
