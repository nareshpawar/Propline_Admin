import { Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';

@Directive({
  selector: 'textarea[appBulletTextBox]'
})
export class BulletTextBoxDirective implements OnInit,OnChanges {
  @Input() stringArray: string[];
  @Output() stringArrayChange = new EventEmitter();
  @HostListener("keydown.enter", ['$event']) onEnter(event: KeyboardEvent) {
    this.rawValue = this.rawValue += '\n• ';
    event.preventDefault();
  }
  @HostListener("change", ['$event']) change(event) {
    this.stringArrayChange.emit(this.rawValue.split("\n• "));
  }

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.changeTextForat();
  }


  changeTextForat(){
    let temp: string = '';
     let text = this.stringArray.map(ele=>{
        return ele.replace("• ",""); 
    }
    )
    text = text.filter(item => item !== '');
    this.stringArray = text;
    
    this.stringArray.forEach(item => {
      if (temp)
        temp += "\r\n";
      temp += '• ' + item;
    });
    
    this.rawValue = temp;
  }

  ngOnChanges(){
    this.changeTextForat();
  }


  get rawValue(): string {
    return this.elementRef.nativeElement.value;
  }
  set rawValue(value: string) {
    this.elementRef.nativeElement.value = value;
  }

 

}
