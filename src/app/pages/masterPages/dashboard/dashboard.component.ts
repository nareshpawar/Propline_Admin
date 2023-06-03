import { Component, OnInit } from '@angular/core';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { MasterPagesServicesService } from '../master-pages-services.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  view: any[] = [900, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Properties';
  colorScheme = {
    domain: ['#4099ff', '#2ed8b6', '#AAAAAA']
  };
  viewP: any[] = [450, 250];
  single: any[];
  gradientP: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'right';
  colorSchemeP = {
    domain: ['#FF5370', '#FBFE08', '#2ed8b6', '#4099ff']
  };
  dashboardCounts: any;
  mapDataCounts: any;
  years: any;
  year: any;
  currentYear: any = new Date().getFullYear() + '';
  constructor(private _hederShowService: HeaderShowServiceService,
    private _masterService: MasterPagesServicesService,) {
  }
  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);
    this.getMapData();
    this.getDashboard();
  }
  getDashboard() {
    this._masterService.getDashboard().subscribe(res => {
      this.dashboardCounts = res.data;
    });
  }
  getMapData() {
    this._masterService.getMapData().subscribe(res => {
      this.mapDataCounts = JSON.parse(res.data);
      this.years = this.mapDataCounts.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.year === value.year
        )))
      this.single = this.mapDataCounts
        .filter(item => item.year === this.currentYear)
        .map(ele => {
          return {
            "name": ele.monthName,
            "value": ele.property
          }
        })
    })
  }

  selectYear() {
    this.single = this.mapDataCounts
      .filter(item => item.year === this.currentYear)
      .map(ele => {
        return {
          "name": ele.monthName,
          "value": ele.property
        }
      })
  }


  ngOnDestroy(): void {
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);
  }


  onSelect(event) {
  }

  onSelectP(data): void {
  }

  onActivate(data): void {
  }

  onDeactivate(data): void {
  }

}
