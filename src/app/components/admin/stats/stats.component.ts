/// <reference path="../../../interfaces/admin/total.stats.interface.ts" />
/// <reference path="../../../interfaces/products/products.interface.ts" />

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Log } from '../../../decorators/log.decorator';
import { AutoUnsubscribe } from '../../../decorators/auto.unsubscribe.decorator';
import { LogObservable } from '../../../decorators/log.observable.decorator';

import { AnalyticsService } from '../../../services/analytics.service';
import { ProductService } from './../../../services/product.service';

import { AdminGuard } from '../../../guards/admin.guard';

import { NgDateRangePickerOptions } from 'ng-daterangepicker';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/observable/forkJoin';

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
  @LogObservable public totalStats: Observable<totalStats.RootObject>;

  public options: NgDateRangePickerOptions;
  public dateRange: string;

  public rangeDoughnutChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };
  public rangeDoughnutChartLabels: string[] = ['Bekeken pagina\'s', 'Bekeken producten'];
  public rangeDoughnutChartData: number[];

  public rangeBarChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [{
        display: true,
        ticks: {
          stepSize: 5,
          beginAtZero: true
        }
      }]
    }
  };

  public rangePagesChartLabels: Array<String> = [
    'Meest bekeken pagina\'s'
  ];
  public rangePagesChartData: Array<any>;
  public rangeProductsChartLabels: Array<String> = [
    'Meest bekeken producten'
  ];
  public rangeProductsChartData: Array<any>;


  // Countto stubs
  public users: any;
  public pages: any;
  public products: any;
  public rangePages: any;
  public rangeProducts: any;

  private analyticSubscription: Subscription;

  constructor(private adminGuard: AdminGuard,
              private productService: ProductService,
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

  public onDateRangeChange() {
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
          const pages = res.filter((item: rangeStats.RootObject) => {
            return item.hasOwnProperty('page');
          });

          const products = res.filter((item: rangeStats.RootObject) => {
            return item.hasOwnProperty('product');
          });

          this.rangeDoughnutChartData = [pages.length, products.length];

          let popularProducts: Array<{'id': string, 'count': number}> = [];
          console.log(products);

          for (const product of products) {
            if (popularProducts.find(x => x.id === product.product)) {
              popularProducts.find(x => x.id === product.product).count += 1;
            } else {
              popularProducts.push(
                {
                  'id': product.product,
                  'count': 1
                }
              );
            }
          }

          let popularPages: Array<{'name': string, 'count': number}> = [];

          for (const page of pages) {
            if (popularPages.find(x => x.name === page.page)) {
              popularPages.find(x => x.name === page.page).count += 1;
            } else {
              popularPages.push(
                {
                  'name': page.page,
                  'count': 1
                }
              );
            }
          }

          popularProducts = popularProducts.sort(function (a, b) {
            return b.count - a.count;
          }).slice(0, 5);

          popularPages = popularPages.sort(function (a, b) {
            return b.count - a.count;
          }).slice(0, 5);

          const pagesData: Array<any> = [];
          const productObservables: Array<Observable<productsInterface.RootObject>> = [];

          for (const popularPage of popularPages) {
            pagesData.push({data: [popularPage.count], label: popularPage.name});
          }

          this.rangePagesChartData = pagesData;

          for (const popularProduct of popularProducts) {
            productObservables.push(this.productService.product(popularProduct.id, true));
          }

          Observable.forkJoin(productObservables).subscribe(
            (combinedRes) => {
              const productData: Array<any> = [];
              for (let i = 0; i < combinedRes.length; i++) {
                console.group();
                console.log(i);
                console.log(combinedRes[i]);
                console.log(popularProducts[i]);
                console.groupEnd();
                productData.push({data: [popularProducts[i].count], label: combinedRes[i].name});
              }

              this.rangeProductsChartData = productData;
            }
          );
        }
      );
  }
}

