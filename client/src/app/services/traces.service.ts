import { Injectable } from '@angular/core';
import { Trace } from 'Trace';

@Injectable({
  providedIn: 'root',
})
export class TracesService {
  
  private static tracesPartage: TracesService;
  traces: Trace[];
  private constructor() {
    this.traces = [];
  }
  static get Instance() {
    return this.tracesPartage || (this.tracesPartage = new this());
  }

  getTaille(): number {
    return this.traces.length;
  }

  setZero(): void {
    while(this.traces.length>0){
      this.traces.pop();
    }
  }

  push(trace: Trace){
    this.traces[this.traces.length] = trace;
  }
}
