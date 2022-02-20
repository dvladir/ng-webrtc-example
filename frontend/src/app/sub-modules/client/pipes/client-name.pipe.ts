import { Pipe, PipeTransform } from '@angular/core';
import {Client} from '../shared/client';

@Pipe({
  name: 'clientName'
})
export class ClientNamePipe implements PipeTransform {

  static transform(client: Client): string {
    return (client && client.name) || 'Guest';
  }

  transform(client: Client): string {
    return ClientNamePipe.transform(client);
  }
}
