import { Controller, Sse, MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('api/events')
export class EventsController {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  @Sse('stream') stream(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'ai.refresh.complete').pipe(map((data) => ({ type: 'ai_refresh_complete', data } as MessageEvent)));
  }
}
