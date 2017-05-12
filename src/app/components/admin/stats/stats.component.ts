import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Log } from '../../../decorators/log.decorator';
import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';
import { LogObservable } from '../../../decorators/log.observable.decorator';

import { AnalyticsService } from '../../../services/analytics.service';

import { AdminGuard } from '../../../guards/admin.guard';

import { NgDateRangePickerOptions } from 'ng-daterangepicker';

import { Subscription } from 'rxjs/Subscription';

import '../../../../../node_modules/chart.js/dist/Chart.bundle.js';

@Component({
  selector: 'app-admin-stats',
  templateUrl: './stats.component.pug',
  styleUrls: ['./stats.component.styl'],
  changeDetection: ChangeDetectionStrategy.Default
})
@Log()
@AutoUnsubscribe()
export class AdminStatsComponent implements OnInit, OnDestroy {

  public options: NgDateRangePickerOptions;
  public dateRange: string;

  @LogObservable private totalStats: Observable<Array<number>>;

  public doughnutChartLabels: string[] = ['Bekeken pagina\'s', 'Bekeken producten'];
  public doughnutChartData: number[];

  private analyticSubscription: Subscription;

  constructor(private adminGuard: AdminGuard,
              private analyticsService: AnalyticsService) {
  }

  ngOnInit(): void {
    this.adminGuard.checkRemote();

    this.options = {
      theme: 'red',
      range: 'tm',
      dayNames: ['Ma', 'Di', 'Wo', 'Do', 'Vrij', 'Zat', 'Zon'],
      presetNames: ['Deze maand', 'Afgelopen maand', 'Deze week', 'Afgelopen week', 'Dit jaar', 'Afgelopen jaar', 'Begin', 'Eind'],
      dateFormat: 'yMd',
      outputFormat: 'DD/MM/YYYY',
      startOfWeek: 1
    };

    this.analyticSubscription = this.analyticsService.visit('AdminStats').subscribe();

    this.totalStats = this.analyticsService.getTotalStats();

    const date = new Date(), y = date.getFullYear(), m = date.getMonth();

    this.getStatsInRange(
      new Date(y, m, 1, 0, 0, 0, 0).getTime(),
      new Date(y, m + 1, 0, 23, 59, 59, 999).getTime()
    );
  }

  ngOnDestroy(): void {
    // pass
  }

  onDateRangeChange() {
    const dates: Array<string> = this.dateRange.split('-');
    const from: Array<string> = dates[0].split('/');
    const to: Array<string> = dates[1].split('/');

    this.getStatsInRange(
      new Date(Number(from[2]), Number(from[1]) - 1, Number(from[0]), 0, 0, 0, 0).getTime(),
      new Date(Number(to[2]), Number(to[1]) - 1, Number(to[0]), 23, 59, 59, 999).getTime()
    );
  }

  private getStatsInRange(from: number, to: number) {
    this.analyticsService.getStatsInRange(from, to).subscribe(
        (res: Array<rangeStats.RootObject>) => {
          console.log(res);
          this.doughnutChartData = [
            res.filter((item: rangeStats.RootObject) => {
              return item.hasOwnProperty('page');
            }).length,
            res.filter((item: rangeStats.RootObject) => {
              return item.hasOwnProperty('product');
            }).length
          ];
        }
      );
  }
}

