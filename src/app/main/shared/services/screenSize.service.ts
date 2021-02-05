import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({providedIn: 'root'})
export class ScreenSizeService {
  constructor(
    private breakpointObserver: BreakpointObserver
  ) { }

  public isSmallScreen() {
    return this.breakpointObserver.observe(Breakpoints.XSmall);
  }

}
