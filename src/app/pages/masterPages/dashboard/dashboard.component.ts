import { Component, OnInit } from '@angular/core';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { MasterPagesServicesService } from '../master-pages-services.service';
import { multi } from './dashboard';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  multi: any[];
  view: any[] = [900, 400];
  // options
  // showXAxis: boolean = true;
  // showYAxis: boolean = true;
  // gradient: boolean = false;
  // showLegend: boolean = true;
  // showXAxisLabel: boolean = true;
  // xAxisLabel: string = 'Month';
  // showYAxisLabel: boolean = true;
  // yAxisLabel: string = 'Population';
  // animations: boolean = true;
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

  //piechart
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

  constructor(  private _hederShowService:HeaderShowServiceService,
    private _masterService: MasterPagesServicesService,) { 
    
    // barchart
    this.multi = [
        {
          "name": "Jan",
          "series": [
            {
              "name": "2010",
              "value": 7300000
            },
            {
              "name": "2011",
              "value": 8940000
            }
          ]
        },
      
        {
          "name": "Feb",
          "series": [
            {
              "name": "2010",
              "value": 7870000
            },
            {
              "name": "2011",
              "value": 8270000
            }
          ]
        },
      
        {
          "name": "mar",
          "series": [
            {
              "name": "2010",
              "value": 5000002
            },
            {
              "name": "2011",
              "value": 5800000
            }
          ]
        },
        {
            "name": "Apr",
            "series": [
              {
                "name": "2010",
                "value": 2000002
              },
              {
                "name": "2011",
                "value": 4800000
              }
            ]
          },
          {
              "name": "may",
              "series": [
                {
                  "name": "2010",
                  "value": 4000002
                },
                {
                  "name": "2011",
                  "value": 8800000
                }
              ]
            },
        {
            "name": "may",
            "series": [
              {
                "name": "2010",
                "value": 8000002
              },
              {
                "name": "2011",
                "value": 5800000
              }
            ]
          },
          {
              "name": "Jun",
              "series": [
                {
                  "name": "2010",
                  "value": 9000002
                },
                {
                  "name": "2011",
                  "value": 4800000
                }
              ]
            },
            {
                "name": "Jul",
                "series": [
                  {
                    "name": "2010",
                    "value": 4000002
                  },
                  {
                    "name": "2011",
                    "value": 6800000
                  }
                ]
              },
              {
                  "name": "Aug",
                  "series": [
                    {
                      "name": "2010",
                      "value": 1000002
                    },
                    {
                      "name": "2011",
                      "value": 5800000
                    }
                  ]
                },
                {
                    "name": "sup",
                    "series": [
                      {
                        "name": "2010",
                        "value": 7000002
                      },
                      {
                        "name": "2011",
                        "value": 5800000
                      }
                    ]
                  },
                  {
                      "name": "Oct",
                      "series": [
                        {
                          "name": "2010",
                          "value": 4000002
                        },
                        {
                          "name": "2011",
                          "value": 9800000
                        }
                      ]
                    },
                    {
                        "name": "Nov",
                        "series": [
                          {
                            "name": "2010",
                            "value": 4000002
                          },
                          {
                            "name": "2011",
                            "value": 1800000
                          }
                        ]
                      },
                      {
                          "name": "Dec",
                          "series": [
                            {
                              "name": "2010",
                              "value": 9000002
                            },
                            {
                              "name": "2011",
                              "value": 8800000
                            }
                          ]
                        }
      ];

      //Piechart

    // this.single = [
    //     {
    //       "name": "Germany",
    //       "value": 8940000
    //     },
    //     {
    //       "name": "USA",
    //       "value": 5000000
    //     },
    //     {
    //       "name": "France",
    //       "value": 7200000
    //     },
    //       {
    //       "name": "UK",
    //       "value": 6200000
    //     }
    //   ];  
  }

  ngOnInit(): void {
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);
    this.getMapData();
    this.getDashboard();
  }

  getDashboard(){
    this._masterService.getDashboard().subscribe(res=>{
      this.dashboardCounts = res.data;
    });
  }

  getMapData(){
    this._masterService.getMapData().subscribe(res=>{
      this.mapDataCounts = JSON.parse(res.data);
      this.years = this.mapDataCounts.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.year === value.year 
        )))

        this.single = this.mapDataCounts
        .filter(item=> item.year === this.currentYear)
        .map(ele=>{
            return {
              "name": ele.monthName,
              "value": ele.property
            }
          })
    })
  }

  selectYear(){
    this.single = this.mapDataCounts
    .filter(item=> item.year === this.currentYear)
    .map(ele=>{
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
        // console.log(event);
      }

      onSelectP(data): void {
        // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
      }
    
      onActivate(data): void {
        // console.log('Activate', JSON.parse(JSON.stringify(data)));
      }
    
      onDeactivate(data): void {
        // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
      }   
  
}
