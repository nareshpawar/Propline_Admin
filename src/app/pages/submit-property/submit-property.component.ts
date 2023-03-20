/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef, NgZone, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { MapsAPILoader } from '@agm/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HeaderShowServiceService } from 'src/app/theme/components/header-show-service.service';
import { PageServicesService } from '../page-services.service';
import { map, Subject, takeUntil } from 'rxjs';
import { stringify } from 'querystring';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { emailValidator } from 'src/app/theme/utils/app-validators';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-submit-property',
  templateUrl: './submit-property.component.html',
  styleUrls: ['./submit-property.component.scss'],
})
export class SubmitPropertyComponent implements OnInit, OnDestroy {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  @ViewChild('addressAutocomplete') addressAutocomplete: ElementRef;
  @ViewChild('bedroom_length') bedroom_length: ElementRef = null;
  @ViewChild('bedroom_breadth') bedroom_breadth: ElementRef = null;
  public submitForm: FormGroup;
  public features = [];
  public priceIncludes = [];
  public transactionType = [];
  public possessionStatus = [];
  public propertyTypes = [];
  public propertyStatuses = [];
  public cities = [];
  public neighborhoods = [];
  public streets = [];
  public lat: number = 40.678178;
  public lng: number = -73.944158;
  public zoom: number = 12;
  bedroomFlag: boolean = false;
  balconieFlag: boolean = false;
  matcher = new MyErrorStateMatcher();
  bedrooms: Array<number> = [];
  balconies: Array<number> = [];
  floorNo: Array<any> = ["Lower Basement", "Upper Basement", "Ground",];
  totalFloors: Array<string> = [];
  furnishedStatus: Array<string> = [];
  bathrooms: Array<string> = [];
  maintenenceChargePer;
  Brokerage = [];
  BedroomNumbers = [];
  BalconiesNumber = [];
  furnishedItemsList = [];
  street_ID: number;
  furnishedAc = [];
  furnishedBed = [];
  furnishedWardrobe = [];
  furnishedTv = [];
  furnishedFlag: boolean = false;
  major: Array<string> = ["Sq-ft", "Sq-yrd", "Sq-m", "Acre", "Bigha", "Hectre", "Marla", "Kanal", "Biswa"]
  availableFromBtn = ["Select Date", "Immidiate"];
  wishToEnter = ["Complete Price Details", "Total Price Only"]
  propTypes: any;
  ageFlag: boolean;
  ageOfPro: Array<string> = ["New Construction", "Less then 5 years", "5 to 10 years", "10 to 15 years", "15 to 20 years", "Above 20 years"]
  expectPrice: boolean = true;
  newPropertyflag: boolean = false;
  otherChargesFlag: boolean;
  addFeature: { id: string; name: string; selected: boolean; }[];
  overlooking: { id: number; name: string; selected: boolean; }[];
  overlookingComm: { id: number; name: string; selected: boolean; }[];
  carParking = [];
  facing = ["Facing", "East", "North", "North-East", "North-West", "South", "South-East", "South-West", "West"];
  multipleUnits = ["Yes", "No"];
  multipleUnitsupto200 = this.makeArray(200);
  pantry = ["Dry", "Wet", "Not Available"]
  ownerShipStatus = ["Freehold", "Leasehold"];
  waterAvailability = ["24 Hours Available",
    "12 Hours Available",
    "6 Hours Available",
    "2 Hours Available",
    "1 Hour Available",];
  electricityStatus = ["No/Rare Powercut",
    "Less Than 2 Hour Powercut",
    "2 To 4 Hours Powercut",
    "4 To 6 Hours Powercut",
    "Over 6 Hours Powercut",]
  flooring = [];
  amenities = [];
  PropertyDescription = '';
  approvedBy = ["Pimpri-Chinchwad New Town Development Authority",
    "Pune Metropolitan Region Development Authority",
    "Developer",
    "RWA/Co-operative Housing Society",
    "Development Authority",
    "City Municipal Corporation"
  ]
  societyData: any;
  selectedNeighborhood: boolean = true;
  selectedStreet: boolean = true;
  project_id: any;
  totalTowers: any[];
  isPoaFlag: boolean = false;
  isLobbyFlag = false;
  expectPriceValue: any;
  expectPricepersqft: any;
  stampDutyIncludedPrice: number;
  finalPrice: any = '';
  projectName: any = '';
  superArea: any = '';
  floor_No: any = '';
  furnished_Status: any = '';
  projectSelect;
  private sub: any;
  availableFlag: boolean = false;

  is_feature_properties = [{ id: 1, name: " Featured Property", selected: false, }]
  isHotProperties = [{ id: 1, name: " Hot Property", selected: false }]
  expectedPrice: any;
  totalFloors_No: any;
  imageFile: any = [];
  covered_imageFile: any = null;
  BrokerageInDays: string[] = [];
  landmarks = ["Metro/Railway", "Bus stop", "Airports", "Shopping Malls", "Office Complex"];
  PopularLandmarks = ["School/College", "Hospitals", "Mall", "Metro Station", "Hospital", "Other"];
  distancefromFlag: boolean = false;
  openSides: any[];
  washrooms: any[];
  meetingRooms: any[];
  businessSector = ["Agro/Flowers/Agriculture/Seeds/Nursery",
    "Airport/Aviation/Aerospace and Related",
    "Four Wheelers/Two Wheelers/Automotive Components/Repair/Auto and Related",
    "Animation & Gaming",
    "Pets and Related",
    "Hospital, Clinics, Biotechnology",
    "Construction Related Products – Cement etc. /Equipments/Ceramic/Cement/Glass",
    "Consumer Durables/Electronic products- TV/Fridge/Camera/Laptops/Computer Hardware",
    "Wood/Furniture and Related",
    "Kitchen Goods and Related",
    "Footwear/Leather",
    "Food And Related – Restaurants, Sweet Shops etc",
    "Gems and Jewellery",
    "Handicrafts & Carpets",
    "IT/ITES/Call Centers/Consulting/Ecommerce etc.",
    "Construction Related Services – Architecture Design, Planning, Contractor etc",
    "Industrial Supplies and Related",
    "Plastic processing",
    "Petrochemicals & petroleum products/oil and gas",
    "Pharmaceuticals/Chemists/Chemicals",
    "Power/alternate energy/solar",
    "Garments/Textiles/Apparel/Wool/Fashion Labels",
    "Writing and printing/ Stationary/Books/Gifts/Cards/Art and Craft etc.",
    "Metals, Nails, Hammer, Paints Hardware Related",
    "Shipping, Transportation, Courier and Logistics",
    "Educational/Coaching Institutes and Related",
    "Real Estate Agency – Brokers, Builder Office etc.",
    "Fitness Centers/Gym etc",
    "Electronics - Mobile and related",
    "Tours, Travels and Related",
    "Financial, Insurance, Legal and Related Services",
    "Media, Advertising and Related",
    "Baby Products, Toys and Related",
    "Religious Products – Idols, Temples, Incense Sticks and Related",
    "Internet/Cable Providers and Related",
    "NGOs/Charitable Trusts and Related",
    "Beauty Spa and Saloon",
    "Photo Studio and Related",
    "Other"]
  // businessSince = ["1910", "1911", "1912", "1913", "1914", "1915", "1916", "1917", "1918", "1919", "1920", "1921", "1922", "1923", "1924", "1925",
  //   "1926", "1927", "1928", "1929", "1930", "1931", "1932", "1933", "1934", "1935", "1936", "1937", "1938", "1939", "1940", "1941",
  //   "1942", "1943", "1944", "1945", "1946", "1947", "1948", "1949", "1950", "1951", "1952", "1953", "1954", "1955", "1956", "1957",
  //   "1958", "1959", "1960", "1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969", "1970", "1971", "1972", "1973",
  //   "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989",
  //   "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000", "2001", "2002", "2003", "2004", "2005",
  //   "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019",];
  businessSince = [];
  passasionStatusCom = ["Under Construction", "Ready to Move"]
  todaysDate = new Date();
  lifts: any[];
  commercialAmentiaies: any;
  specialZone = ["Special Economic Zone", "Free Trade Zone", "Export Processing Zone", "Free Zone", "Industrial Estate", "Free Ports",
    "Urban Enterprice Zones", "Software Technology Park", "Electronic Hardware Technology Park", "Export Oriented Unit", "Bio Technology Park"]
  vanueType = ["Business Center", "Hospital", "Hotel", "Airport", "Corporate Office", "Railway Station", "Residential Area", "Metro Station", "SEZ/IT Park", "Bus Terminal",
    "Shoping Complex", "Shoping Mall", "Cafe", "Coworking", "Tech Park"]
  buildingClass = ["Not Applicable", "Grade A+", "Grade A", "Grade B", "Grade C"];
  leedCertified = ["Not Applicable", "Certified", "Silver Certified", "Gold Certified", "Platinum Certified"]
  displayAditionalFeaturPage: boolean;
  flooringComm: { id: number; name: string; selected: boolean; }[];
  propertyTypesData: any;
  propertyNameData: any;
  lokInPeriods = ["6 Months", "12 Months", "24 Months", "36 Months"]
  constructor(public appService: AppService,
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _hederShowService: HeaderShowServiceService,
    private _pageService: PageServicesService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService) { }
  ngOnInit() {
    this.bussinessYearCalculate(2050);
    this.getPropertyTypeController();
    this.sub = this.activatedRoute.params.subscribe(params => {
      if (params.id) {
        this.getPropertyById(params['id']);
      }
    });
    this._hederShowService.headerFlag.next(false);
    this._hederShowService.submitButtonFlag.next(false);
    this.features = this.appService.getFeatures();
    this.priceIncludes = this.appService.getPriceIncludes();
    // this.propertyTypes = this.appService.getPropertyTypes();
    this.propertyStatuses = this.appService.getPropertyStatuses();
    // this.cities = this.appService.getCities();
    // this.neighborhoods = this.appService.getNeighborhoods();
    // this.streets = this.appService.getStreets();
    this.transactionType = this.appService.getTransactionType();
    this.possessionStatus = this.appService.getPossessionStatus();
    this.furnishedItemsList = this.appService.getFurnishedItemList();
    this.addFeature = this.appService.getAddFeature();
    this.overlooking = this.appService.getOverlooking();
    this.overlookingComm = this.appService.getOverlookingComm();
    this.carParking = this.appService.getCarParking();
    this.flooring = this.appService.getFlooring();
    this.flooringComm = this.appService.getFlooringComm();

    this.amenities = this.appService.getAmenities();
    this.commercialAmentiaies = this.appService.getCommercialAmenities();
    this.submitForm = this.fb.group({
      propertyId: '',
      // owner: this.fb.group({
      //   owners: this.fb.array([this.createOwner()])
      // }),
      address: this.fb.group({
        projectName: ['', Validators.required],
        location: '',  //  Validators.required
        city: '',       //  Validators.required
        zipCode: '',
        neighborhood: '',
        street: '',
        propertyType: [null, Validators.required],
        propertyStatus: [null, Validators.required],
        // gallery: null,
        reraId: null
      }),
      document: this.fb.group({
        covered_image: null,
        gallery: null,
        listOfDocument: null,
        index2: null,
        POA: null,
        societyRegCert: null,
        bank: null,
        completionCertificate: null
      }),
      additional: this.fb.group({
        is_feature_property: this.is_feature_propertiesItem(),
        is_hot_listed: this.is_hot_listedItem(),
        bedrooms: '',
        bathrooms: ['', Validators.required],
        balconies: '',
        leaving_room_details: this.fb.group({
          length: '',
          breadth: '',
        }),
        kitchen_details: this.fb.group({
          length: '',
          breadth: '',
        }),
        furnishedStatus: ['', Validators.required],
        furnishedAc: '',
        furnishedBed: '',
        furnishedWardrobe: '',
        furnishedTv: '',
        furnishedItems: this.furnishedItems(),
        floorNo: ['', Validators.required],
        flat_no: '',
        total_floor: ['', Validators.required],
        tower: ['', Validators.required],
        superArea: '',
        super_major: 'Sq-ft',
        carpetArea: ['', Validators.required],
        carpet_major: ['Sq-ft', Validators.required],
        builtUpArea: '',
        built_major: 'Sq-ft',
        ageOfProperty: '',
        lobyDetails: this.lobbyMethod(),
        transactionType: this.buildTransactionType(),
        possessionStatus: this.buildPossessionStatus(),
        expectedPrice: '',
        pricePerSqft: ['', Validators.required],
        priceIncludes: this.buildPriceIncludes(),
        brokerageIncluded: '',
        maintenenceCharges: null,
        maintenenceChargesPerYear: null,
        brokerage: '',
        brokerageInDays: "",
        brokeragePrice: "",
        bedroomSizes: null,
        balconieSize: null,
        otherCharges: '',
        agreementCharges: '',
        availableFrom: null,
        availFromBtn: null,
        monthlyRent: '',
        securityAmount: '',

        wishToEnterRd: null,
        basic_price: null,
        floor_plc: null,
        facing_plc: null,
        open_car_parking: null,
        open_car_parking_per: null,
        covered_car_parking: null,
        covered_car_parking_per: null,
        club_membership: null,
        serviceTax: null,
        elecWaterCharge: false,
        powerbackup: null,
        electricity: null,
        leaseRent: null,
        ifms: null,
        eecffc: null,
        stampDuty: '',
        stampIncluded: '',
        regCharge: '',
        finalPrice: ['', Validators.required],
        // kitchen: false,
      }),
      propertyFeature: this.fb.group({
        addFeature: this.addFeatureItems(),
        overlooking: this.overlookingItems(),
        carParking: this.carParkingItems(),
        facing: '',
        // mulUnitsAvail: '',
        statusElectricity: '',
        availabilityWater: '',
        ownershipStatus: '',
        approvedByAuthority: '',
        approvedBy: '',
        // addDeal: '',
        flooring: this.flooringItems(),
        amenities: this.AmenitiesItems(),
        landmarkNeighbourhood: '',
        // showOnBrokerConnect: false,
        teUsMore: '',
        // features: this.buildFeatures(),
        coOperative: '',
        Convenience: '',
        propertyDetails: this.fb.array([]),
      }),
      commercial: this.fb.group({
        shopNo: null,
        landmark: "Metro/Railway", //              ["Metro/Railway",Validators.required],
        transactionType: this.buildTransactionType(),
        possessionStatus: null,
        availableFrom: null,
        ageOfProperty: '',
        currentLeast: '',
        priceIncludes: this.buildPriceIncludes(),
        maintenenceCharges: null, //   [null,Validators.required],
        maintenenceChargesPerYear: null, //[null,Validators.required],
        brokerage: null, // [null,Validators.required],
        metroRailway: null,
        busStops: null,
        airport: null,
        shoppingMall: null,
        officeComplex: null,
        distanceFromProperty: null,
        floorNo: null,//[null,Validators.required],
        totalFoors: null,//[null,Validators.required],
        furnishedStatus: null,//[null,Validators.required],
        bedrooms: null,
        floorAllowCunstruction: null,
        noOfSides: null,
        widthOfRoadFacingPlot: null,
        washrooms: null,
        numberOfSeats: null,
        cabinOrMeetingRooms: null,
        cornerShop: null,
        mainRoadFacing: null,
        personalWash: null,
        Cafeteria: null,

        coverdArea: null,//[null,Validators.required],
        coveredMessure: null,//["Sq-ft",Validators.required],

        plotArea: null,//[null,Validators.required],
        plotMessure: null,//["Sq-ft",Validators.required],

        plotLength: null,
        plotBreadth: null,

        builtUpArea: null,
        built_major: null,

        carpetArea: [null, Validators.required],
        carpetMessure: "Sq-ft",

        widthEntrance: null,
        wdthEntranceMessure: null,

        widthOfFacingRoad: null,
        widthOfFacingRoadMessure: null,

        monthlyRent: null,
        monthlyRentToLease: null,
        leasedOn: null,
        currentBussinessSecctor: null,
        inBusinessSince: null,
        assuredReturns: null,
        rateOfReturn: null,

        expectedPrice: [null, Validators.required],
        expectedPricePerSqft: [null, Validators.required],

        otherCharges: [null, Validators.required],
        bookingOrTokenAmount: [null, Validators.required],
        availFromBtn: null,
        securityAmount: null,
        lockInPeriod: null,
        modifuInterior: null,
        yearlyrentexpectedincrease: null,
        widthOfFacingRoadmeasure: null,
        wdthEntrancemeasure: null,
        brokeragePrice: null,
        finalPrice: null

      }),
      commercialPropertyFeature: this.fb.group({
        facing: null,
        overlooking: this.overlookingItemsComm(),
        carParking: this.carParkingItems(),
        liftsInTower: null,
        officeOnTheFloor: null,
        ShopsShowroomsOnTheFloor: null,
        mulUnitsAvail: null,
        multipleUnitsForShop: null,
        specialZone: null,
        vanueType: null,
        VirtualSpace: null,
        buildingClass: null,
        leadCertificate: null,
        ProjectRERAID: null,
        availabilityWater: null,
        statusElectricity: null,
        ownershipStatus: null,
        approvedByAuthority: null,
        approvedBy: null,
        flooring: this.flooringItemsComm(),
        amenities: this.commAmenitiesItems(),
        propertyDetails: this.fb.array([]),
        popularLandmark: null,
        universitySchool: null,
        hospitals: null,
        distanceFromProperty2nd: null,
        Description: null,

      })

    });
    this.getSociety();
    this.getCitiesController();
    this.getNeighborhoodController();
    this.getStreetController();
    this.getFeatures();
    this.setCurrentPosition();
    this.placesAutocomplete();
    this.bedrooms = this.makeArray(10);
    this.balconies = this.makeArray(10);
    this.washrooms = this.makeArray(10);
    this.meetingRooms = this.makeArray(30);
    this.lifts = this.makeArray(15);
    this.makeArray(50)?.forEach((ele, i) => {
      this.floorNo?.push(ele);
      if (i == 49) {
        this.floorNo?.push("50+")
      }
    })
    this.totalFloors = this.makeArray(50);
    this.totalFloors.push("50+")
    this.totalTowers = this.makeArray(12);
    this.openSides = this.makeArray(4);
    this.furnishedStatus = ["Furnished", "Unfurnished", "Semi-Furnished"];
    this.bathrooms = this.makeArray(10);
    this.furnishedAc = this.makeFurnisheArray(3);
    this.furnishedBed = this.makeFurnisheArray(3);
    this.furnishedWardrobe = this.makeFurnisheArray(3);
    this.furnishedTv = this.makeFurnisheArray(3);
    this.maintenenceChargePer = ["Monthly", "Quarterly", "Yearly", "One-Time", "Per sq. Unit Monthly"];
    this.Brokerage = ["0%", "0.25%", "0.5%", "0.75%", "1%", "1.5%", "2%", "3%"]
    this.BrokerageInDays = ["15 Days", "30 Days", "45 Days", "60 Days"]


  }
  propertyTypeChangeEvent() {
    let propertyFor;
    propertyFor = this.propertyTypesData?.find(item => item?.property_type_id == this.propertyName.value);
    if (propertyFor?.property_name === "Commercial") {
      this.displayAditionalFeaturPage = true;
      this.getPropertyName();
    } else {
      this.displayAditionalFeaturPage = false;
    }
    // this.getPropertyName();
  }
  get propertyName() {
    return this.submitForm.get('address')['controls'].propertyType as FormControl;
  }
  getPropertyName() {
    let data = this.propertyTypesData?.find(item => item?.property_type_id == this.propertyName.value);

    this.propertyNameData = data?.property_desc;
  }
  get currentLeaseOut() {
    return this.submitForm.get('commercial')['controls'].currentLeast as FormControl;
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this._hederShowService.headerFlag.next(true);
    this._hederShowService.submitButtonFlag.next(true);
    this.furnishedFlag = false;
    this.bedroomFlag = false;
    this.balconieFlag = false;
    this.isPoaFlag = false;
    this.isLobbyFlag = false;
    this.distancefromFlag = false;
  }
  public onSelectionChange(e: any) {
    if (e.selectedIndex == 2) {
      this.addDescription();
      this.addDescriptionComm();
    }
    if (e.selectedIndex == 4) {
      this.horizontalStepper._steps?.forEach(step => step.editable = false);
    }
  }
  selectLandmarks(event: any) {
    this.distancefromFlag = true;
  }
  public reset() {
    this.horizontalStepper.reset();
    this.bedroomFlag = false;
    this.balconieFlag = false;
    this.furnishedFlag = false;
    this.BedroomNumbers = [];
    this.BalconiesNumber = [];

    this.isPoaFlag = false;
    // const videos = <FormArray>this.submitForm.controls.media.get('videos');
    // while (videos.length > 1) {
    //   videos.removeAt(0)
    // }
    // const plans = <FormArray>this.submitForm.controls.media.get('plans');
    // while (plans.length > 1) {
    //   plans.removeAt(0)
    // }
    // const owner = <FormArray>this.submitForm.controls.owner.get('owners');
    // while (owner.length > 1) {
    //   owner.removeAt(0)
    // }
    // const additionalFeatures = <FormArray>this.submitForm.controls.media.get('additionalFeatures');
    // while (additionalFeatures.length > 1) {
    //   additionalFeatures.removeAt(0)
    // }
    this.submitForm.reset({
      additional: {
        features: this.features
      },
      // media: {
      //   featured: false
      // }
    });
  }
  // -------------------- API calls -------------------------
  notifier = new Subject();
  getCitiesController() {
    this._pageService
      .getCitiesController()
      .pipe(takeUntil(this.notifier))
      .subscribe((res: any) => {
        this.cities = res.data;
      })
  }
  neighborhoodController;
  getNeighborhoodController() {
    this._pageService
      .getNeighborhoodController()
      .pipe(takeUntil(this.notifier))
      .subscribe((res: any) => {
        this.neighborhoodController = res.data;
        this.neighborhoods = this.neighborhoodController?.map(neighbor => {
          return {
            neighborhood_id: neighbor.neighborhood_id,
            neighborhood: neighbor.neighborhood,
            city_id: neighbor.cities.city_id,
          };
        })
      })
  }
  streetController;
  getStreetController() {
    this._pageService.getStreetController().pipe(takeUntil(this.notifier)).subscribe((res: any) => {
      this.streetController = res.data;
      this.streets = this.streetController?.map(street => {
        return {
          street_id: street.street_id,
          street: street.street,
          neighborhood_id: street.neighborhood.neighborhood_id,
          city_id: street.neighborhood.cities.city_id,
        };
      })
    })
  }
  getPropertyTypeController() {
    this._pageService.getPropertyTypeController().pipe(takeUntil(this.notifier)).subscribe((res: any) => {
      // this.propertyTypes = res.data;
      this.propertyTypesData = res.data;

      let commercial = [];
      let residential = [];
      res.data?.forEach(element => {
        if (element.property_name === "Residential") {
          residential?.push(element);
        } else if (element.property_name === "Commercial") {
          commercial?.push(element);
        }
      });
      let commerObj = {
        type: 'Commercial',
        arr: commercial
      }
      let resideObj = {
        type: 'Residential',
        arr: residential
      }
      this.propertyTypes?.push(resideObj);
      this.propertyTypes?.push(commerObj);
    })
  }
  getFeatures() {
    this._pageService.getFeatues().pipe(takeUntil(this.notifier)).subscribe((res: any) => {
      this.features = res.data;
    })
  }
  getSociety() {
    this._pageService.getSocietyMaster().pipe(takeUntil(this.notifier)).subscribe((res: any) => {
      this.societyData = res.data.sort((a, b) => a.society < b.society ? -1 : 1);
    })
  }
  // -------------------- Address ---------------------------  
  slectProject(proId) {
    let proname;
    this.societyData?.forEach(element => {
      if (element.society_id == proId) {
        proname = element;
      }
    });
    this.project_id = proname.society_id
    this.submitForm.controls.address['controls'].city.setValue(proname.streets.neighborhood.cities.city);
    this.submitForm.controls.address['controls'].city.disable();
    this.submitForm.controls.address['controls'].neighborhood.setValue(proname.streets.neighborhood.neighborhood);
    this.submitForm.controls.address['controls'].neighborhood.disable();

    this.submitForm.controls.address['controls'].street.setValue(proname.streets.street);
    this.submitForm.controls.address['controls'].street.disable();

    this.submitForm.controls.address['controls'].zipCode.setValue(proname.pin);
    this.submitForm.controls.address['controls'].zipCode.disable();

    this.submitForm.controls.address['controls'].location.setValue(proname.location);
    this.submitForm.controls.address['controls'].location.disable();

    // this.selectedCity = false; 
    this.selectedNeighborhood = false;
    this.selectedStreet = false;
    this.projectName = this.submitForm["controls"].address['controls'].projectName;
  }
  public onSelectCity(Id) {
    // this.selectedCity = true;
    // this.submitForm.controls.address.get('neighborhood').setValue(null, { emitEvent: false });
    // this.submitForm.controls.address.get('street').setValue(null, { emitEvent: false });
    this.neighborhoods = this.neighborhoods.filter(x => x.city_id === Id);
  }
  public onSelectNeighborhood(arr) {
    this.selectedNeighborhood = true;
    // this.submitForm.controls.address.get('street').setValue(null, { emitEvent: false });
    this.streets = this.streets.filter(x => x.neighborhood_id === arr.neighborhood_id);
  }
  onSelectStreet(event) {
    this.selectedStreet = true;
    this.street_ID = event.street_id;
  }
  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }
  private placesAutocomplete() {
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.addressAutocomplete.nativeElement, {
        types: ["address"]
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          };
          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.getAddress();
        });
      });
    });
  }
  public getAddress() {
    this.appService.getAddress(this.lat, this.lng).subscribe(response => {
      if (response['results'].length) {
        let address = response['results'][0].formatted_address;
        this.submitForm.controls.address.get('location').setValue(address);
        this.setAddresses(response['results'][0]);
      }
    })
  }
  public onMapClick(e: any) {
    this.lat = e.coords.lat;
    this.lng = e.coords.lng;
    this.getAddress();
  }
  public setAddresses(result) {
    this.submitForm.controls.address.get('city').setValue(null);
    this.submitForm.controls.address.get('zipCode').setValue(null);
    this.submitForm.controls.address.get('street').setValue(null);
    var newCity, newStreet, newNeighborhood;
    result.address_components?.forEach(item => {
      if (item.types.indexOf('locality') > -1) {
        if (this.cities.filter(city => city.city == item.long_name)[0]) {
          newCity = this.cities.filter(city => city.city == item.long_name)[0];
        }
        else {
          newCity = { id: this.cities.length + 1, city: item.long_name };
          this.cities?.push(newCity);
        }
        this.submitForm.controls.address.get('city').setValue(newCity);
      }
      if (item.types.indexOf('postal_code') > -1) {
        this.submitForm.controls.address.get('zipCode').setValue(item.long_name);
      }
    });
    if (!newCity) {
      result.address_components?.forEach(item => {
        if (item.types.indexOf('administrative_area_level_1') > -1) {
          if (this.cities.filter(city => city.city == item.long_name)[0]) {
            newCity = this.cities.filter(city => city.city == item.long_name)[0];
          }
          else {
            newCity = {
              id: this.cities.length + 1,
              name: item.long_name
            };
            this.cities?.push(newCity);
          }
          this.submitForm.controls.address.get('city').setValue(newCity);
        }
      });
    }
    if (newCity) {
      result.address_components?.forEach(item => {
        if (item.types.indexOf('neighborhood') > -1) {
          let neighborhood = this.neighborhoods.filter(n => n.neighborhood == item.long_name && n.city_id == newCity.id)[0];
          if (neighborhood) {
            newNeighborhood = neighborhood;
          }
          else {
            newNeighborhood = {
              id: this.neighborhoods.length + 1,
              name: item.long_name,
              cityId: newCity.id
            };
            this.neighborhoods?.push(newNeighborhood);
          }
          this.neighborhoods = [...this.neighborhoods];
          this.submitForm.controls.address.get('neighborhood').setValue([newNeighborhood]);
        }
      })
    }

    if (newCity) {
      result.address_components?.forEach(item => {
        if (item.types.indexOf('route') > -1) {
          if (this.streets.filter(street => street.street == item.long_name && street.street_id == newCity.id)[0]) {
            newStreet = this.streets.filter(street => street.street == item.long_name && street.street_id == newCity.id)[0];
          }
          else {
            newStreet = {
              id: this.streets.length + 1,
              name: item.long_name,
              cityId: newCity.id,
              neighborhoodId: (newNeighborhood) ? newNeighborhood.id : null
            };
            this.streets?.push(newStreet);
          }
          this.streets = [...this.streets];
          this.submitForm.controls.address.get('street').setValue([newStreet]);
        }
      })
    }
  }
  // -------------------- Additional ---------------------------  
  propeertyStatus(propertyType) {
    this.propTypes = propertyType;
    if (propertyType == "For Rent") {
      this.submitForm.controls.address['controls'].reraId.disable();
      this.submitForm.controls.commercial['controls'].expectedPrice.clearValidators();
      this.submitForm.controls.commercial['controls'].expectedPrice.updateValueAndValidity();
      this.submitForm.controls.commercial['controls'].expectedPricePerSqft.clearValidators();
      this.submitForm.controls.commercial['controls'].expectedPricePerSqft.updateValueAndValidity();
      this.submitForm.controls.commercial['controls'].bookingOrTokenAmount.clearValidators();
      this.submitForm.controls.commercial['controls'].bookingOrTokenAmount.updateValueAndValidity();
    } else {
      this.submitForm.controls.address['controls'].reraId.enable();
      this.submitForm.controls.commercial['controls'].expectedPrice.setValidators([Validators.required]);
      this.submitForm.controls.commercial['controls'].expectedPrice.updateValueAndValidity();
      this.submitForm.controls.commercial['controls'].expectedPricePerSqft.setValidators([Validators.required]);
      this.submitForm.controls.commercial['controls'].expectedPricePerSqft.updateValueAndValidity();
      this.submitForm.controls.commercial['controls'].bookingOrTokenAmount.setValidators([Validators.required]);
      this.submitForm.controls.commercial['controls'].bookingOrTokenAmount.updateValueAndValidity();
    }
    if (propertyType == "For Rent" && !this.displayAditionalFeaturPage) {
      // this.availableFlag = false;
      this.ageFlag = true;
      this.submitForm.controls.address['controls'].reraId.disable();
      this.submitForm.controls.additional['controls'].stampDuty.clearValidators();
      this.submitForm.controls.additional['controls'].stampDuty.updateValueAndValidity();
      this.submitForm.controls.additional['controls'].expectedPrice.clearValidators();
      this.submitForm.controls.additional['controls'].expectedPrice.updateValueAndValidity();
      this.submitForm.controls.additional['controls'].pricePerSqft.clearValidators();
      this.submitForm.controls.additional['controls'].pricePerSqft.updateValueAndValidity();
      this.submitForm.controls.additional['controls'].priceIncludes.clearValidators();
      this.submitForm.controls.additional['controls'].priceIncludes.updateValueAndValidity();
    } else if (propertyType == "For Sale" && !this.displayAditionalFeaturPage) {
      // this.availableFlag = true;
      this.ageFlag = false;
      this.submitForm.controls.address['controls'].reraId.enable();
      this.submitForm.controls.additional['controls'].stampDuty.setValidators([Validators.required]);
      this.submitForm.controls.additional['controls'].stampDuty.updateValueAndValidity();
      this.submitForm.controls.additional['controls'].expectedPrice.setValidators([Validators.required]);
      this.submitForm.controls.additional['controls'].expectedPrice.updateValueAndValidity();
      this.submitForm.controls.additional['controls'].pricePerSqft.setValidators([Validators.required]);
      this.submitForm.controls.additional['controls'].pricePerSqft.updateValueAndValidity();
      this.submitForm.controls.additional['controls'].priceIncludes.setValidators([Validators.required]);
      this.submitForm.controls.additional['controls'].priceIncludes.updateValueAndValidity();
    }

  }
  availFromBtn(avail) {
    // console.log(avail);

    if (avail == "Select Date") {
      this.availableFlag = true;
      this.submitForm.controls.additional['controls'].availableFrom.setValidators([Validators.required]);
      this.submitForm.controls.additional['controls'].availableFrom.updateValueAndValidity();
    } else {
      this.availableFlag = false;
      this.submitForm.controls.additional['controls'].availableFrom.clearValidators([Validators.required]);
      this.submitForm.controls.additional['controls'].availableFrom.updateValueAndValidity();
    }
  }
  wishToEntermetho(value) {
    if (value == "Complete Price Details") {
      this.expectPrice = false;
      this.otherChargesFlag = true;

    } else if (value == "Total Price Only") {
      this.expectPrice = true;
      this.otherChargesFlag = false;
    }
  }
  // public buildFeatures() {
  //   const arr = this.features.map(feature => {
  //     return this.fb.group({
  //       id: feature.id,
  //       name: feature.name,
  //       selected: feature.selected
  //     });
  //   })
  //   return this.fb.array(arr);
  // }
  public buildPriceIncludes() {
    const arr = this.priceIncludes?.map(pricein => {
      return this.fb.group({
        id: pricein.id,
        name: pricein.name,
        selected: pricein.selected
      });
    })
    return this.fb.array(arr);
  }
  public is_feature_propertiesItem() {
    const arr = this.is_feature_properties?.map(item => {
      return this.fb.group({
        id: item.id,
        name: item.name,
        selected: item.selected,
      })
    })
    return this.fb.array(arr);

  }
  public is_hot_listedItem() {
    const arr = this.isHotProperties?.map(item => {
      return this.fb.group({
        id: item.id,
        name: item.name,
        selected: item.selected,
      })
    })
    return this.fb.array(arr);

  }
  public furnishedItems() {
    const arr = this.furnishedItemsList?.map(fur => {
      return this.fb.group({
        id: fur.id,
        name: fur.name,
        selected: fur.selected,
      })
    })
    return this.fb.array(arr);
  }
  public overlookingItems() {
    const arr = this.overlooking?.map(ele => {
      return this.fb.group({
        id: ele.id,
        name: ele.name,
        selected: ele.selected,
      })
    })
    return this.fb.array(arr);
  }
  public overlookingItemsComm() {
    const arr = this.overlookingComm?.map(ele => {
      return this.fb.group({
        id: ele.id,
        name: ele.name,
        selected: ele.selected,
      })
    })
    return this.fb.array(arr);
  }
  public flooringItems() {
    const arr = this.flooring?.map(ele => {
      return this.fb.group({
        id: ele.id,
        name: ele.name,
        selected: ele.selected,
      })
    })
    return this.fb.array(arr);
  }
  public flooringItemsComm() {
    const arr = this.flooringComm?.map(ele => {
      return this.fb.group({
        id: ele.id,
        name: ele.name,
        selected: ele.selected,
      })
    })
    return this.fb.array(arr);
  }
  public AmenitiesItems() {
    const arr = this.amenities?.map(ele => {
      return this.fb.group({
        id: ele.id,
        name: ele.name,
        selected: ele.selected,
      })
    })
    return this.fb.array(arr);
  }
  public commAmenitiesItems() {
    const arr = this.commercialAmentiaies?.map(ele => {
      return this.fb.group({
        id: ele.id,
        name: ele.name,
        selected: ele.selected,
      })
    })
    return this.fb.array(arr);

  }
  public addFeatureItems() {
    const arr = this.addFeature?.map(ele => {
      return this.fb.group({
        id: ele.id,
        name: ele.name,
        selected: ele.selected,
      })
    })
    return this.fb.array(arr);
  }
  public carParkingItems() {
    const arr = this.carParking?.map(ele => {
      return this.fb.group({
        id: ele.id,
        name: ele.name,
        selected: ele.selected,
        unit: ele.unit
      })
    })
    return this.fb.array(arr);
  }
  public buildTransactionType() {
    const arr = this.transactionType?.map(Transaction => {
      return this.fb.group({
        id: Transaction.id,
        name: Transaction.name,
        selected: Transaction.selected,
        type: Transaction.type
      });
    })
    return this.fb.array(arr);
  }
  public buildPossessionStatus() {
    const arr = this.possessionStatus?.map(possession => {
      return this.fb.group({
        id: possession.id,
        name: possession.name,
        selected: possession.selected,
        type: possession.type
      });
    })
    return this.fb.array(arr);
  }
  public buildBedrromList() {
    let arr = this.BedroomNumbers?.map(Trans => {
      return this.fb.group({
        "length": Trans.bedroom_length,
        "breadth": Trans.bedroom_breadth
      });
    })
    return this.fb.array(arr);
  }
  public balconiesList() {
    let arr = this.BalconiesNumber?.map(Trans => {
      return this.fb.group({
        "length": Trans.bedroom_length,
        "breadth": Trans.bedroom_breadth
      });
    })
    return this.fb.array(arr);
  }
  checked(event, Object) {
    let TTnewcheckbox = this.submitForm.get('additional')['controls'].transactionType.controls;
    let PSRecheckbox = this.submitForm.get('additional')['controls'].possessionStatus.controls;
    if (Object.type == "Transaction") {
      TTnewcheckbox?.forEach(element => {
        if (Object.id === element.value.id) {
          element.patchValue({ selected: true });
        } else if (Object.id !== element.value.id) {
          element.patchValue({ selected: false });
        }
      })
      if (Object.name == "Resale") {
        this.expectPrice = true;
        this.newPropertyflag = false;
        this.otherChargesFlag = false;

      } else if (Object.name == "New Property") {
        this.expectPrice = false;
        this.newPropertyflag = true;
        if (this.submitForm.get('additional')['controls'].wishToEnterRd.value == 'Complete Price Details') {
          this.otherChargesFlag = true;
          this.expectPrice = false;

        } else {
          this.expectPrice = true;
          this.otherChargesFlag = false;

        }

      }
    } else if (Object.type == "Possession") {
      PSRecheckbox?.forEach(element => {
        if (Object.id === element.value.id) {
          element.patchValue({ selected: true });
        } else if (Object.id !== element.value.id) {
          element.patchValue({ selected: false });
        }
      });
      if (Object.name == "Under Construction") {
        // this.availableFlag = true;
        this.ageFlag = false;
      } else if (Object.name == "Ready to Move") {
        // this.availableFlag = false;
        this.ageFlag = true;
      }
    }
    if (Object.name === "Resale") {
      this.ageFlag = true;
      PSRecheckbox[0].patchValue({ selected: false });
      PSRecheckbox[1].patchValue({ selected: event.checked });
      // Object.selected = true
    } else if ((Object.name == "New Property")) {
      this.ageFlag = false;
      // PSRecheckbox[0].patchValue({selected : false});
      PSRecheckbox[1].patchValue({ selected: false });
      // Object.selected = false;
    }
  }
  bedSelection(bed) {
    this.bedroomFlag = true;
    this.BedroomNumbers = [];
    for (let i = 1; i <= bed; i++) {
      this.BedroomNumbers?.push({
        "length": "",
        "breadth": ""
      })
    }
    this.submitForm.controls.additional.get('bedroomSizes').setValue(this.buildBedrromList());
  }
  balconiesSelection(balconie) {
    this.balconieFlag = true;
    this.BalconiesNumber = [];
    for (let i = 1; i <= balconie; i++) {
      this.BalconiesNumber?.push({
        "length": "",
        "breadth": ""
      })
    }
    this.submitForm.controls.additional.get('balconieSize').setValue(this.balconiesList());
  }
  setbalconies(balconie) {
    this.balconieFlag = true;
    this.submitForm.controls.additional.get('balconieSize').setValue(this.setbalconiesList());
  }
  setBed(bed) {
    this.bedroomFlag = true;
    this.submitForm.controls.additional.get('bedroomSizes').setValue(this.setBedrromList());
  }
  public setBedrromList() {
    // console.log(this.BedroomNumbers);
    if (this.BedroomNumbers !== null) {
      let arr = this.BedroomNumbers?.map(Trans => {
        return this.fb.group({
          "length": Trans?.length,
          "breadth": Trans?.breadth
        });
      })
      return this.fb?.array(arr);
    }
  }
  public setbalconiesList() {

    if (this.BalconiesNumber !== null) {
      let arr = this.BalconiesNumber?.map(Trans => {
        return this.fb.group({
          "length": Trans?.length,
          "breadth": Trans?.breadth
        });
      })
      return this.fb?.array(arr);

    }
  }
  furnishedSelection(status) {
    this.furnished_Status = status;
    if (status == "Furnished" || status == "Semi-Furnished") {
      this.furnishedFlag = true;
      // this.submitForm.get("additional")['controls'].furnishedAc.setValidators([Validators.required]);
      // this.submitForm.get("additional")['controls'].furnishedBed.setValidators([Validators.required]);      
      // this.submitForm.get("additional")['controls'].furnishedWardrobe.setValidators([Validators.required]);      
      // this.submitForm.get("additional")['controls'].furnishedTv.setValidators([Validators.required]);      
    } else {
      this.furnishedFlag = false;
      // this.submitForm.get("additional")['controls'].furnishedAc.clearValidators([Validators.required]);
      // this.submitForm.get("additional")['controls'].furnishedBed.clearValidators([Validators.required]);      
      // this.submitForm.get("additional")['controls'].furnishedWardrobe.clearValidators([Validators.required]);      
      // this.submitForm.get("additional")['controls'].furnishedTv.clearValidators([Validators.required]); 
    }
  }
  get bedrromList() {
    return this.submitForm.controls.additional.get('bedroomSizes') as FormArray;
  }
  onInputType(element, messurement, i) {
    let index = i;
    let inpuValue = element;
    let bedsizeFormArray = this.submitForm.controls.additional.get('bedroomSizes').value;
    bedsizeFormArray.controls?.forEach((element, i) => {
      if (messurement == Object.keys(element.value)[0] && index == i) {
        element.controls.length.setValue(inpuValue)
      } else if (messurement == Object.keys(element.value)[1] && index == i) {
        element.controls.breadth.setValue(inpuValue);
      }
    });
  }
  onBalInputtypes(element, messurement, j) {
    let index = j;
    let inpuValue = element;
    let balSizeFormArray = this.submitForm.controls.additional.get('balconieSize').value;
    balSizeFormArray.controls?.forEach((element, i) => {
      if (messurement == Object.keys(element.value)[0] && index == i) {
        element.controls.length.setValue(inpuValue)
      } else if (messurement == Object.keys(element.value)[1] && index == i) {
        element.controls.breadth.setValue(inpuValue);
      }
    });
  }
  
  // public createOwner(): FormGroup {
  //   return this.fb.group({
  //     name: [null,Validators.required],
  //     mobile: this.fb.array([this.createMobile()]),
  //     email: this.fb.array([this.createMobileOrEmail()]),
  //   });
  // }
  // [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]

  // public createMobile(){
  //   return this.fb.control('',[Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]);

  // }
  // public createMobileOrEmail() {
  //   return this.fb.control('',emailValidator);
  // }
  // public addPlan(): void {
  //   const plans = this.submitForm.controls.media.get('plans') as FormArray;
  //   plans?.push(this.createPlan());
  // }
  // public addOwners(): void {
  //   const owners = this.submitForm.controls.owner.get('owners') as FormArray;
  //   owners?.push(this.createOwner());
  // }
  // public addDetail(index, mobOrEmail): void {
  //   if (mobOrEmail == 'mobile') {
  //     const mobiles = this.submitForm.controls.owner['controls'].owners.controls[index].controls.mobile as FormArray;
  //     mobiles?.push(this.createMobileOrEmail());
  //   } else if (mobOrEmail == 'email') {
  //     const email = this.submitForm.controls.owner['controls'].owners.controls[index].controls.email as FormArray;
  //     email?.push(this.createMobileOrEmail());
  //   }

  // }
  // public deletePlan(index) {
  //   const plans = this.submitForm.controls.media.get('plans') as FormArray;
  //   plans.removeAt(index);
  // }
  // public deleteOwner(index) {
  //   const owners = this.submitForm.controls.owner.get('owners') as FormArray;
  //   owners.removeAt(index);
  // }
  // removeMobileOrEmail(owner_index,email_mobile_index ,emailOrMob) {
  //   if (emailOrMob == 'email') {
  //     const email = this.submitForm.controls.owner['controls'].owners.controls[owner_index].controls.email as FormArray;
  //     email.removeAt(email_mobile_index);
  //   } else if (emailOrMob == 'mobile') {

  //     const mobiles = this.submitForm.controls.owner['controls'].owners.controls[owner_index].controls.mobile as FormArray;
  //     mobiles.removeAt(email_mobile_index);
  //   }

  // }
  private removeInvalid(formGroup: any) {
    (<any>Object).values(formGroup.controls)?.forEach(control => {
      control.clearValidators();
      control.updateValueAndValidity();

      if (control.controls) {
        this.removeInvalid(control);
      }
    });
  }
  public createFeature(): FormGroup {
    return this.fb.group({
      id: null,
      name: null,
      value: null
    });
  }
  // public addFeature(): void {
  //   const features = this.submitForm.controls.media.get('additionalFeatures') as FormArray;
  //   features?.push(this.createFeature());
  // }
  // public deleteFeature(index) {
  //   const features = this.submitForm.controls.media.get('additionalFeatures') as FormArray;
  //   features.removeAt(index);
  // }
  public makeArray(count: any) {
    var result = [];
    for (var i = 1; i <= count; i++) {
      result?.push(i);
    }
    return result;
  }
  public makeFurnisheArray(count: any) {
    var result = [];
    for (var i = 0; i <= count; i++) {
      result?.push(i);
      if (i == count) {
        result?.push(i + "+")
      }
    }
    return result;
  }
  isPoaAvailable() {
    this.isPoaFlag = !this.isPoaFlag;
  }
  isLobby(value) {
    if (value.checked) {
      this.isLobbyFlag = true;
      this.submitForm.controls.additional['controls'].lobyDetails.controls.length.setValidators([Validators.required]);
      this.submitForm.controls.additional['controls'].lobyDetails.controls.length.updateValueAndValidity();

      this.submitForm.controls.additional['controls'].lobyDetails.controls.breadth.setValidators([Validators.required]);
      this.submitForm.controls.additional['controls'].lobyDetails.controls.breadth.updateValueAndValidity();

    } else {
      this.submitForm.controls.additional['controls'].lobyDetails.controls.length.setValue('');
      this.submitForm.controls.additional['controls'].lobyDetails.controls.length.clearValidators([Validators.required]);
      this.submitForm.controls.additional['controls'].lobyDetails.controls.length.updateValueAndValidity();


      this.submitForm.controls.additional['controls'].lobyDetails.controls.breadth.setValue('');
      this.submitForm.controls.additional['controls'].lobyDetails.controls.breadth.clearValidators([Validators.required]);
      this.submitForm.controls.additional['controls'].lobyDetails.controls.breadth.updateValueAndValidity();


      this.isLobbyFlag = false;

    }
  }
  lobbyMethod() {
    return this.fb.group({
      isAvailable: false,
      length: '',
      breadth: ''
    })
  }
  calculationMethod() {
    //Expected Price

    let pricePerSqft_value = (Number(this.submitForm["controls"].additional['controls'].expectedPrice.value) / Number(this.submitForm["controls"].additional['controls'].carpetArea.value));
    this.submitForm["controls"].additional['controls'].pricePerSqft.setValue(Math.round(pricePerSqft_value));
    this.expectPricepersqft = Math.round(this.submitForm["controls"].additional['controls'].pricePerSqft.value);

    //Stamp Duty 

    let stampIncluded_value = ((Number(this.submitForm.value.additional.expectedPrice) * Number(this.submitForm.value.additional.stampDuty)) / 100)
    this.submitForm["controls"].additional['controls'].stampIncluded.setValue(Math.round(stampIncluded_value));
    this.stampDutyIncludedPrice = Math.round(Number(this.submitForm["controls"].additional['controls'].stampIncluded.value));

    //Brokerage
    if (this.submitForm.value.additional.brokerage !== "No Brokerage" || this.submitForm.value.additional.brokerage !== '') {
      if (Number(this.submitForm.value.additional.expectedPrice) !== 0 && this.submitForm.value.additional.brokerage !== '') {
        let value = ((Number(this.submitForm.value.additional.expectedPrice)) * (parseFloat(this.submitForm.value.additional.brokerage)) / 100);
        this.submitForm["controls"].additional['controls'].brokerageIncluded.setValue(Math.round(value));
      }

    } else {
      this.submitForm["controls"].additional['controls'].brokerageIncluded.setValue("0");
    }
    let finalValue = (Number(this.submitForm.value.additional.stampIncluded)) +
      (Number(this.submitForm.value.additional.otherCharges)) +
      (Number(this.submitForm.value.additional.regCharge)) +
      (Number(this.submitForm.value.additional.brokerageIncluded)) +
      Number(this.submitForm.value.additional.expectedPrice)
    // + Number(this.submitForm.value.additional.agreementCharges)
    this.submitForm["controls"].additional['controls'].finalPrice.setValue(finalValue);
    this.finalPrice = this.submitForm["controls"].additional['controls'].finalPrice;
    this.superArea = this.submitForm["controls"].additional['controls'].superArea;
    this.floor_No = this.submitForm["controls"].additional['controls'].floorNo;

  }
  // calculatePrice() {
  //   let value = ((Number(this.submitForm.value.additional.expectedPrice) * Number(this.submitForm.value.additional.stampDuty)) / 100)
  //   //+ Number(this.submitForm.value.additional.expectedPrice)
  //   this.submitForm["controls"].additional['controls'].stampIncluded.setValue(Math.round(value));
  //   this.stampDutyIncludedPrice = Math.round(Number(this.submitForm["controls"].additional['controls'].stampIncluded.value));
  // }
  // ExpectedPriceperSQFT() {
  //   this.expectPriceValue = Number(this.submitForm.value.additional.expectedPrice);
  //   let value = ((Number(this.submitForm.value.additional.expectedPrice)) / Number(this.submitForm.value.additional.carpetArea))
  //   this.submitForm["controls"].additional['controls'].pricePerSqft.setValue(Math.round(value));
  //   this.expectPricepersqft = Math.round(Number(this.submitForm.value.additional.pricePerSqft));
  // }
  // brokerageIncludedCal() {
  //   if (this.submitForm.value.additional.brokerage !== "No Brokerage") {
  //     let value = ((Number(this.submitForm.value.additional.expectedPrice)) * (parseFloat(this.submitForm.value.additional.brokerage)) / 100);
  //     this.submitForm["controls"].additional['controls'].brokerageIncluded.setValue(Math.round(value));
  //   } else {
  //     this.submitForm["controls"].additional['controls'].brokerageIncluded.setValue("0");
  //   }
  //   let finalValue = (Number(this.submitForm.value.additional.stampIncluded)) + (Number(this.submitForm.value.additional.otherCharges)) + (Number(this.submitForm.value.additional.regCharge)) + (Number(this.submitForm.value.additional.brokerageIncluded))
  //   this.submitForm["controls"].additional['controls'].finalPrice.setValue(finalValue);
  //   this.finalPrice = this.submitForm["controls"].additional['controls'].finalPrice;
  //   this.superArea = this.submitForm["controls"].additional['controls'].superArea;
  //   this.floor_No = this.submitForm["controls"].additional['controls'].floorNo;
  // }
  get propertyDetails() {
    return this.submitForm.controls.propertyFeature['controls'].propertyDetails as FormArray;
  }
  addDescription() {
    this.projectName = this.submitForm.value.address.projectName;
    this.superArea = this.submitForm.value.additional.superArea;
    this.finalPrice = this.submitForm.value.additional.finalPrice;
    this.expectedPrice = this.submitForm.value.address.propertyStatus === "For Sale" ? this.submitForm.value.additional.expectedPrice : this.submitForm.value.additional.monthlyRent;
    this.floor_No = this.submitForm.value.additional.floorNo;
    this.totalFloors_No = this.submitForm.value.additional.total_floor
    this.furnished_Status = this.submitForm.value.additional.furnishedStatus;
    let formarr = this.description().controls;
    this.propertyDetails.clear();
    formarr?.forEach(element => {
      this.propertyDetails?.push(element);
    });
  }
  description() {
    if (this.finalPrice == '' && this.finalPrice === undefined && this.finalPrice === 'undefined') {
      this.finalPrice = '_____'
    };
    if (this.furnished_Status == '') {
      this.furnished_Status = '_____'
    }
    if (this.projectName == '') {
      this.projectName = '_____'
    }
    if (this.superArea == '') {
      this.superArea = '_____'
    }
    if (this.floor_No == '') {
      this.floor_No = '_____'
    }
    let sentence = ['At a price of Rs ' + String(this.expectedPrice) + ', this prime location is listed out ' + this.submitForm.value.address.propertyStatus.toLowerCase() + '.',
    'This ' + String(this.furnished_Status) + ' property is situated at ' + String(this.floor_No) + ' in a ' + String(this.totalFloors_No) + ' of storey building.',
      'This road view facing apartment is a prime choice for those who seek a luxurious lifestyle.',
    'This prime location has a ' + String(this.superArea) + ' sqft area.',
      'The property is well ventilated and spacious and is a perfect choice for families.',
      'With attached market, well maintained building and 24 x 7 security, residents can have a secure and peaceful life.'];
    // let wordArray = sentence.split('.');
    return this.fb.array(sentence);
  }
  get propertyDetailsComm() {

    return this.submitForm.controls.commercialPropertyFeature['controls'].propertyDetails as FormArray;
  }
  addDescriptionComm() {

    this.projectName = this.submitForm.value.address.projectName;
    this.superArea = ""
    this.finalPrice = ""
    this.expectedPrice = this.submitForm.value.commercial.expectedPrice !== null ? this.submitForm.value.commercial.expectedPrice : 0;
    this.floor_No = this.submitForm.value.commercial.floorNo;
    this.totalFloors_No = this.submitForm.value.commercial.totalFoors
    this.furnished_Status = this.submitForm.value.commercial.furnishedStatus;
    let formarr = this.description().controls;
    this.propertyDetailsComm.clear();
    formarr?.forEach(element => {
      this.propertyDetailsComm?.push(element);
    });
  }
  get commercial() {
    return this.submitForm.controls.commercial as FormGroup;
  }
  get commercialPropertyFeature() {
    return this.submitForm.controls.commercialPropertyFeature as FormGroup;
  }
  getPropertyById(id) {

    this._pageService.getPropertyById(id).subscribe(res => {
      let formData = res.data;
      this.commercial.patchValue(formData?.commercial_details);
      this.getBrokerageCommercialValue(formData?.commercial_details?.brokerage);
      this.commercialPropertyFeature.patchValue(formData?.commercial_extra);
      //  let owner = {
      //     owners: formData.ownerDetails
      //   }
      let address = {
        projectName: formData?.society?.society_id,
        location: formData?.society?.location,
        city: formData?.society?.streets?.neighborhood?.cities?.city,
        zipCode: formData?.society?.pin,
        neighborhood: formData?.society?.streets?.neighborhood?.neighborhood,
        street: formData?.society?.streets?.street,
        propertyType: formData?.property_type,
        propertyStatus: formData?.property_for,
        reraId: formData?.extra_details?.reraId
      }
      // document: this.fb.group({
      //   gallery: null,
      //   listOfDocument: null,
      //   index2: null,
      //   POA: null,
      //   societyRegCert: null,
      //   bank: null,
      //   completionCertificate: null
      // }),
      let additional = {
        is_feature_property: [
          { id: 1, name: " Featured Property", selected: formData?.is_feature_property }
        ],
        is_hot_listed: [
          { id: 1, name: " Hot Property", selected: formData?.is_hot_listed },
        ],
        bedrooms: formData?.property_features?.Bedrooms,
        bathrooms: formData?.property_features?.bathrooms,
        balconies: formData?.property_features?.Balconies,
        leaving_room_details: formData?.leaving_room_details,
        kitchen_details: formData?.kitchen_details,
        furnishedStatus: formData?.property_features?.furnishedStatus,
        furnishedAc: formData?.property_features?.furnishedAc,
        furnishedBed: formData?.property_features?.furnishedBed,
        furnishedWardrobe: formData?.property_features?.furnishedWardrobe,
        furnishedTv: formData?.property_features?.furnishedTv,
        furnishedItems: formData?.furnished_items,
        floorNo: formData?.property_features?.floorNo,
        total_floor: formData?.property_features?.total_floor,
        tower: formData?.property_features?.tower,
        superArea: formData?.property_area?.superArea,
        super_major: formData?.property_area?.super_major,
        carpetArea: formData?.property_area?.carpetArea,
        carpet_major: formData?.property_area?.carpet_major,
        builtUpArea: formData?.property_area?.builtUpArea,
        built_major: formData?.property_area?.built_major,
        ageOfProperty: formData?.age_of_property,
        lobyDetails: formData?.lobby_details,
        transactionType: formData?.transaction_type === "New Property" ? [
          {
            id: 1,
            name: "New Property",
            selected: true,
            type: "Transaction"
          },
          {
            id: 2,
            name: "Resale",
            selected: false,
            type: "Transaction"
          },]
          : [
            {
              id: 1,
              name: "New Property",
              selected: false,
              type: "Transaction"
            },
            {
              id: 2,
              name: "Resale",
              selected: true,
              type: "Transaction"
            },
          ],
        possessionStatus: formData?.possession_status == "Under Construction" ? [
          {
            id: 1,
            name: "Under Construction",
            selected: true,
            type: "Possession"
          },
          {
            id: 2,
            name: "Ready to Move",
            selected: false,
            type: "Possession"
          }] : [
          {
            id: 1,
            name: "Under Construction",
            selected: false,
            type: "Possession"
          },
          {
            id: 2,
            name: "Ready to Move",
            selected: true,
            type: "Possession"
          },
        ],
        expectedPrice: formData?.price_details?.expectedPrice,
        pricePerSqft: formData?.price_details?.pricePerSqft,
        priceIncludes: formData?.price_details?.priceIncludes,
        brokerageIncluded: formData?.price_details?.brokerageIncluded,
        maintenenceCharges: formData?.price_details?.maintenenceCharges,
        maintenenceChargesPerYear: formData?.price_details?.maintenenceChargesPerYear,
        brokerage: formData?.price_details?.brokerage,
        otherCharges: formData?.price_details?.OtherCharges,
        securityAmount: formData?.rent_lease_details?.securityAmount,
        agreementCharges: formData?.extra_details?.agreementCharges,
        stampDuty: formData?.price_details?.stampDuty,
        stampIncluded: formData?.price_details?.stampIncluded,
        regCharge: formData?.price_details?.regCharge,
        finalPrice: formData?.price_details?.finalPrice,
        monthlyRent: formData?.extra_details?.monthlyRent,
        flat_no: formData?.extra_details?.flat_no,
        brokerageInDays: formData?.extra_details?.brokerageInDays,
        brokeragePrice: formData?.extra_details?.brokeragePrice,
        availFromBtn: formData?.extra_details?.availFromBtn,
        availableFrom: formData?.extra_details?.availableFrom
        // bedroomSizes:formData?.bedroomsList,
        // balconieSize:formData?.balcony_list
      }
      formData?.flooring?.forEach(element => {
        this.flooring?.forEach(ele => {
          if (element.id == ele.id) {
            ele.id = element.id;
            ele.name = element.name;
            ele.selected = element.selected;
          }
        })
      }
      )
      formData?.amenities?.forEach(element => {
        this.amenities?.forEach(ele => {
          if (element.id == ele.id) {
            ele.id = element.id;
            ele.name = element.name;
            ele.selected = element.selected;
          }
        })
      }
      )
      let propertyFeature = {
        overlooking: formData?.overlooking,

        carParking: [{
          id: 1,
          name: "Covered",
          selected: formData?.extra_details?.covered,
          unit: formData?.extra_details?.input_covered
        },
        {
          id: 2,
          name: "Open",
          selected: formData?.extra_details?.open,
          unit: formData?.extra_details?.input_open
        },
        {
          id: 3,
          name: "Common",
          selected: formData?.extra_details?.Common,
          unit: formData?.extra_details?.input_Common
        },
        {
          id: 4,
          name: "None Of This",
          selected: formData?.extra_details?.car_non_of_this,
          unit: ''
        },
        ],
        facing: formData?.extra_details?.facing,
        statusElectricity: formData?.status_of_water?.electricityStatus,
        availabilityWater: formData?.status_of_water?.waterAvailability,
        ownershipStatus: formData?.ownership_status,
        approvedByAuthority: formData?.extra_details?.approvedByAuthority!,
        addFeature: formData?.property_features?.addFeature,
        approvedBy: formData?.extra_details?.approvedBy,
        flooring: this.flooring,
        amenities: this.amenities,
        // propertyDetails: formData?.property_desc,
        landmarkNeighbourhood: formData?.extra_details?.landmarkNeighbourhood,
        teUsMore: formData?.extra_details?.teUsMore,
        coOperative: formData?.extra_details?.coOperative,
        Convenience: formData?.extra_details?.Convenience,
      }

      this.project_id = formData?.society?.society_id;
      this.submitForm.controls.address.patchValue(address);
      if (this.submitForm.controls.address['controls'].propertyStatus.value === 'For Rent') {
        this.submitForm.controls.address['controls'].reraId.disable();
      } else {
        this.submitForm.controls.address['controls'].reraId.enable();
      }
      this.submitForm.controls.address['controls'].city.disable();
      this.submitForm.controls.address['controls'].neighborhood.disable();
      this.submitForm.controls.address['controls'].street.disable();
      this.submitForm.controls.address['controls'].location.disable();
      this.submitForm.controls.address['controls'].zipCode.disable();
      this.propeertyStatus(formData?.property_for);



      this.submitForm.controls["propertyId"].setValue(formData?.propertyId);

      this.propertyTypeChangeEvent();

      this.BedroomNumbers = formData?.bedroomsList;
      this.BalconiesNumber = formData?.balcony_list;
      this.setBed(additional.bedrooms);
      this.setbalconies(additional.balconies);
      // this.submitForm.controls.additional.get('balconieSize').setValue(this.fb.array(formData?.balcony_list));
      // this.submitForm.controls.additional.get('bedroomSizes').setValue(this.fb.array(formData?.bedroomsList));

      this.furnishedSelection(formData?.property_features?.furnishedStatus);
      let lobby = { checked: formData?.lobby_details?.isAvailable }
      this.isLobby(lobby);
      // this.addDescription();
      this.submitForm.controls.additional.patchValue(additional);
      this.availFromBtn(this.submitForm.controls.additional.get('availFromBtn').value);

      this.submitForm.controls.propertyFeature.patchValue(propertyFeature);
      this.covered_imageFile = formData?.covered_image.Big;
      formData?.gallery_media?.forEach(element => {
        this.imageFile?.push(element.big)
      });

      let listOfDocument = [];

      formData.documentList.forEach(element => {
        listOfDocument.push(element);
      });
      this.submitForm.controls.document.get("listOfDocument").setValue(listOfDocument);

      let index2 = [];
      formData.otherDocs.forEach(element => {
        index2.push(element);
      });
      this.submitForm.controls.document.get("index2").setValue(index2);
      let societyRegCert = [];
      formData.societyRegCertificate.forEach(element => {
        societyRegCert.push(element)

      });
      this.submitForm.controls.document.get("societyRegCert").setValue(societyRegCert);
      let bankDocumnet = []
      formData.bankDocs.forEach(element => {
        bankDocumnet.push(element);

      });
      this.submitForm.controls.document.get("bank").setValue(bankDocumnet);
      let completionCertificate = []
      formData.completionDocs.forEach(element => {
        completionCertificate.push(element);
      });
      this.submitForm.controls.document.get("completionCertificate").setValue(completionCertificate);

    }
    )

  }
  selectFile() {
    this.imageFile = [];
  }
  selectDoc(){
    console.log(this.submitForm.controls.document.get("listOfDocument").value);
  }
  selectCoverFile() {
    this.covered_imageFile = null;
  }
  get transaction() {
    return this.submitForm.get('commercial')['controls'].transactionType['controls'] as FormControl;
  }
  TransactionSelectionChange(event, transactionType) {
    if (event.checked && transactionType.id === 1) {
      this.transaction[1].controls.selected.setValue(false);
    } else if (event.checked && transactionType.id === 2) {
      this.transaction[0].controls.selected.setValue(false);
    }
  }
  get overlookingItem() {
    return this.submitForm.get('commercialPropertyFeature')['controls'].overlooking as FormArray;
  }
  OverlookingEvent(id, event) {
    if (event.checked && this.overlookingItem.controls[0].value.id === id) {
      this.overlookingItem.controls[1]['controls'].selected.setValue(false);
    } else if (event.checked && this.overlookingItem.controls[1].value.id === id) {
      this.overlookingItem.controls[0]['controls'].selected.setValue(false);
    }
  }
  carpetAreaPricePerSqft() {

    let carpetArea = this.submitForm["controls"].commercial['controls'].carpetArea.value === '' ? 0 : Number(this.submitForm["controls"].commercial['controls'].carpetArea.value)
    let expectedPrice = this.submitForm["controls"].commercial['controls'].expectedPrice.value === null ? 0 : (Number(this.submitForm["controls"].commercial['controls'].expectedPrice.value));
    let pricePerSqft_value = 0;
    if (expectedPrice == 0 && carpetArea == 0) {
      pricePerSqft_value = 0;
    } else if (expectedPrice != 0 && carpetArea == 0) {
      pricePerSqft_value = 0;
    } else if (expectedPrice == 0 && carpetArea != 0) {
      pricePerSqft_value = 0;
    } else {
      pricePerSqft_value = expectedPrice / carpetArea;
    }
    this.submitForm["controls"].commercial['controls'].expectedPricePerSqft.setValue(Math.round(pricePerSqft_value));
  }
  bussinessYearCalculate(year) {
    let buYear = 1910;
    for (let i = buYear; i <= year; i++) {
      this.businessSince?.push(String(i));
    }
  }
  getBrokerageValue(brokerage) {
    let brokerageDays = brokerage.value
    let rent = Number(this.submitForm["controls"].additional['controls'].monthlyRent.value);
    let brokeragePrice = 0
    if (brokerageDays == "15 Days") {
      brokeragePrice = (rent / 2);
    } else if (brokerageDays == "30 Days") {
      brokeragePrice = rent;
    } else if (brokerageDays == "45 Days") {
      brokeragePrice = rent + (rent / 2);
    } else if (brokerageDays == "60 Days") {
      brokeragePrice = rent + rent;
    }
    this.submitForm["controls"].additional['controls'].brokeragePrice.setValue(brokeragePrice);
    this.calculationMethod()
  }
  getBrokerageCommercialValue(brokerage) {
    let brokerageDays = brokerage
    let rent = Number(this.submitForm["controls"].commercial['controls'].monthlyRentToLease.value);
    let brokeragePrice = 0
    if (brokerageDays == "15 Days") {
      brokeragePrice = (rent / 2);
    } else if (brokerageDays == "30 Days") {
      brokeragePrice = rent;
    } else if (brokerageDays == "45 Days") {
      brokeragePrice = rent + (rent / 2);
    } else if (brokerageDays == "60 Days") {
      brokeragePrice = rent + rent;
    }
    this.submitForm["controls"].commercial['controls'].brokeragePrice.setValue(brokeragePrice);
    this.calculateFinalPrice();
  }
  calculateFinalPrice() {
    let expected = Number(this.submitForm["controls"].commercial['controls'].monthlyRentToLease.value);
    let otherChages = Number(this.submitForm["controls"].commercial['controls'].otherCharges.value);
    let securityAmount = Number(this.submitForm["controls"].commercial['controls'].securityAmount.value);
    let booking = Number(this.submitForm["controls"].commercial['controls'].bookingOrTokenAmount.value);
    let maintenence = Number(this.submitForm["controls"].commercial['controls'].maintenenceCharges.value);
    let brockerage = Number(this.submitForm["controls"].commercial['controls'].brokeragePrice.value);
    let final = expected + otherChages + booking + securityAmount + brockerage;
    this.submitForm["controls"].commercial['controls'].finalPrice.setValue(final);
  }

  formSubmit() {
    if (this.displayAditionalFeaturPage) {
      this.submitForm.get('additional').clearValidators();
      this.removeInvalid(this.submitForm.get('additional'));
      this.submitForm.get('propertyFeature').clearValidators();
    } else {
      this.submitForm.get('commercial').clearValidators();
      this.removeInvalid(this.submitForm.get('commercial'));
      this.submitForm.get('commercialPropertyFeature').clearValidators();
      this.removeInvalid(this.submitForm.get('commercialPropertyFeature'));
      this.submitForm.get('commercial').updateValueAndValidity();
      this.submitForm.get('commercialPropertyFeature').updateValueAndValidity();
    }
    if (this.submitForm.invalid) {
      this.toastr.error('', 'Somthing went Wrong');
      return
    }
    let tranType;
    let possStat;
    let feature = [];
    this.submitForm.value.additional.transactionType?.forEach(element => {
      if (element.selected === true) {
        tranType = element.name;
      }
    });
    this.submitForm.value.additional.possessionStatus?.forEach(element => {
      if (element.selected === true) {
        possStat = element.name;
      }
    });
    let amenities = [];
    let flooring = []
    this.submitForm.value.propertyFeature.amenities?.forEach(ele => {
      if (ele.selected) {
        amenities?.push(ele);
      }
    })
    this.submitForm.value.propertyFeature.flooring?.forEach(ele => {
      if (ele.selected) {
        flooring?.push(ele);
      }
    })

    let finalArray = {
      "propertyId": this.submitForm.value.propertyId,
      "property_for": this.submitForm.value.address?.propertyStatus,
      "property_type": this.submitForm.value.address?.propertyType,
      "transaction_type": tranType,
      "possession_status": possStat,
      "property_desc": this.submitForm.value.propertyFeature?.propertyDetails,
      "age_of_property": this.submitForm.value.additional?.ageOfProperty,
      "ownership_status": this.submitForm.value.propertyFeature?.ownershipStatus,
      "is_feature_property": this.submitForm.value.additional?.is_feature_property[0]?.selected,
      "is_hot_listed": this.submitForm.value.additional?.is_hot_listed[0]?.selected,
      "rent_lease_details": {
        "monthlyRent": this.submitForm.value.additional?.monthlyRent,
        "securityAmount": this.submitForm.value.additional?.securityAmount
      },
      "status_of_water": {
        "waterAvailability": this.submitForm.value.propertyFeature?.availabilityWater,
        "electricityStatus": this.submitForm.value.propertyFeature?.statusElectricity
      },
      "property_features": {
        "Bedrooms": this.submitForm.value.additional?.bedrooms,
        "Balconies": this.submitForm.value.additional?.balconies,

        "floorNo": this.submitForm.value.additional?.floorNo,
        "total_floor": this.submitForm.value.additional?.total_floor,
        "bathrooms": this.submitForm.value.additional?.bathrooms,
        "furnishedStatus": this.submitForm.value.additional?.furnishedStatus,
        "furnishedAc": this.submitForm.value.additional?.furnishedAc,
        "furnishedBed": this.submitForm.value.additional?.furnishedBed,
        "furnishedWardrobe": this.submitForm.value.additional?.furnishedWardrobe,
        "furnishedTv": this.submitForm.value.additional?.furnishedTv,
        "tower": this.submitForm.value.additional?.tower,
        "addFeature": this.submitForm.value.propertyFeature?.addFeature,
      },
      "bedroomsList": this.submitForm.value.additional?.bedroomSizes?.value,
      "balcony_list": this.submitForm.value.additional?.balconieSize?.value,
      "property_area": {
        "superArea": this.submitForm?.value?.additional?.superArea,
        "super_major": this.submitForm?.value?.additional?.super_major,
        "builtUpArea": this.submitForm?.value?.additional?.builtUpArea,
        "built_major": this.submitForm?.value?.additional?.built_major,
        "carpetArea": this.submitForm?.value?.additional?.carpetArea,
        "carpet_major": this.submitForm?.value?.additional?.carpet_major,
      },
      "price_details": {
        "expectedPrice": this.submitForm.value.additional?.expectedPrice,
        "pricePerSqft": this.submitForm.value.additional?.pricePerSqft,
        "brokerageIncluded": this.submitForm.value.additional?.brokerageIncluded,
        "maintenenceCharges": this.submitForm.value.additional?.maintenenceCharges,
        "maintenenceChargesPerYear": this.submitForm.value.additional?.maintenenceChargesPerYear,
        "brokerage": this.submitForm.value.additional?.brokerage,

        "OtherCharges": this.submitForm.value.additional?.otherCharges,
        "priceIncludes": this.submitForm.value.additional?.priceIncludes,
        "stampDuty": this.submitForm.value.additional?.stampDuty,
        "stampIncluded": this.submitForm.value.additional?.stampIncluded,
        "regCharge": this.submitForm.value.additional?.regCharge,
        "finalPrice": this.submitForm.value.additional?.finalPrice,

      },
      "is_property_active": true,
      "extra_details": {
        "approvedBy": this.submitForm.value.propertyFeature.approvedBy,
        "facing": this.submitForm.value.propertyFeature.facing,
        "landmarkNeighbourhood": this.submitForm.value.propertyFeature.landmarkNeighbourhood,
        "teUsMore": this.submitForm.value.propertyFeature.teUsMore,
        "coOperative": this.submitForm.value.propertyFeature.coOperative,
        "Convenience": this.submitForm.value.propertyFeature.Convenience,
        "covered": this.submitForm.value.propertyFeature.carParking[0]?.name == "Covered" ? this.submitForm.value.propertyFeature.carParking[0]?.selected : false,
        "input_covered": this.submitForm.value.propertyFeature.carParking[0]?.name == "Covered" ? this.submitForm.value.propertyFeature.carParking[0]?.unit : '',
        "open": this.submitForm.value.propertyFeature.carParking[1]?.name == "Open" ? this.submitForm.value.propertyFeature.carParking[1]?.selected : false,
        "input_open": this.submitForm.value.propertyFeature.carParking[1]?.name == "Open" ? this.submitForm.value.propertyFeature.carParking[1]?.unit : '',
        "Common": this.submitForm.value.propertyFeature.carParking[2]?.name == "Common" ? this.submitForm.value.propertyFeature.carParking[2]?.selected : false,
        "input_Common": this.submitForm.value.propertyFeature.carParking[2]?.name == "Common" ? this.submitForm.value.propertyFeature.carParking[2]?.unit : '',
        "car_non_of_this": this.submitForm.value.propertyFeature.carParking[3]?.name == 'None Of This' ? this.submitForm.value.propertyFeature?.carParking[3].selected : false,
        "approvedByAuthority": this.submitForm.value.propertyFeature.approvedByAuthority,
        "reraId": this.submitForm.value.address.reraId,
        "availableFrom": this.submitForm.value.additional?.availableFrom,
        "availFromBtn": this.submitForm.value.additional?.availFromBtn,
        "monthlyRent": this.submitForm.value.additional?.monthlyRent,
        "securityAmount": this.submitForm.value.additional?.securityAmount,
        "flat_no": this.submitForm.value.additional?.flat_no,
        "brokerageInDays": this.submitForm.value.additional?.brokerageInDays,
        "brokeragePrice": this.submitForm.value.additional?.brokeragePrice,
        "agreementCharges": this.submitForm.value.additional?.agreementCharges,

      },
      "leaving_room_details": this.submitForm.value.additional.leaving_room_details,
      "lobby_details": this.submitForm.value.additional.lobyDetails,
      "kitchen_details": this.submitForm.value.additional.kitchen_details,
      "furnished_items": this.submitForm.value.additional.furnishedItems,
      "overlooking": this.submitForm.value.propertyFeature.overlooking,
      "flooring": flooring,
      "amenities": amenities,
      "commercial_details": this.submitForm.value.commercial,
      "commercial_extra": this.submitForm.value.commercialPropertyFeature
    }
    let gallery = this.submitForm.value.document.gallery;
    let covered_image = this.submitForm.value.document.covered_image;
    let docfiles = this.submitForm.value.document.listOfDocument;
    let otherfiles = this.submitForm.value.document.index2;
    let societyRegCert = this.submitForm.value.document.societyRegCert;
    let bank = this.submitForm.value.document.bank;
    let completionCertificate = this.submitForm.value.document.completionCertificate;
    const formData: FormData = new FormData();
    formData.append("property", JSON.stringify(finalArray));

    if (gallery !== null && gallery.length != 0) {
      gallery?.forEach(ele => {
        formData.append("media_files", ele.file);
      })
    }
    if (covered_image !== null && covered_image.length != 0) {
      covered_image?.forEach(ele => {
        formData.append("covered_image", ele.file);
      })
    }
    if (docfiles !== null && docfiles.length != 0) {
      docfiles?.forEach(element => {
        element.file ? formData.append("doc_files", element.file) : formData.append("doc_files", element);
      });
    }
    if (otherfiles !== null && otherfiles.length != 0) {
      otherfiles?.forEach(element => {
        element.file ? formData.append("other_files", element.file) : formData.append("other_files", element);
      });
    }
    if (societyRegCert !== null && societyRegCert.length != 0) {
      societyRegCert?.forEach(element => {
        element.file ? formData.append("reg_docs", element.file) : formData.append("reg_docs", element);
      });
    }
    if (bank !== null && bank.length != 0) {
      bank?.forEach(element => {
        element.file ? formData.append("bank_docs", element.file) : formData.append("bank_docs", element);
      });
    }
    if (completionCertificate !== null && completionCertificate.length != 0) {
      completionCertificate?.forEach(element => {
        element.file ? formData.append("comp_docs", element.file) : formData.append("comp_docs", element);
      });
    }
   
    
    this.getPropertyDetails(this.project_id, formData);
  }
  
  getPropertyDetails(project_id, propertyDetails) {
    this._pageService.getPropertyDetails(project_id, propertyDetails).subscribe((res: any) => {
      this.submitForm.reset();
      this.toastr.success('', 'Data Submited Successfully');
    }, error => {
      this.toastr.error('', 'Something Went Wrong');
    })
  }
}