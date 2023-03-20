import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
   name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {
  // transform(value: any): string {
  //   if (value && isInteger(value))
  //     return  numToWords(value);
    
  //   return value;
  // }
  transform(value: any, args?: any): any {
    if (value) {
      value = parseFloat(value).toFixed(2);
      let amounth = value.toString().split(".");
      let price: any = amounth[0];
      let pointer: any = amounth.length > 0 ? amounth[1] : null;
      var singleDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
        doubleDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
        tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
        handle_tens = function (digit: any, prevdigit: any) {
          return 0 == digit ? "" : " " + (1 == digit ? doubleDigit[prevdigit] : tensPlace[digit])
        },
        handle_utlc = function (digit: any, nextdigit: any, denom: any) {
          return (0 != digit && 1 != nextdigit ? " " + singleDigit[digit] : "") + (0 != nextdigit || digit > 0 ? " " + denom : "")
        };
      var rupees = "",
        digitIndex = 0,
        digit = 0,
        nextDigit = 0,
        words = [],
        paisaWords = [],
        paisa = "";
      if (price += "", isNaN(parseFloat(price))) rupees = "";
      else if (parseFloat(price) > 0 && price.length <= 10) {
        for (digitIndex = price.length - 1; digitIndex >= 0; digitIndex--)
          switch (digit = price[digitIndex] - 0, nextDigit = digitIndex > 0 ? price[digitIndex - 1] - 0 : 0, price.length - digitIndex - 1) {
            case 0:
              words.push(handle_utlc(digit, nextDigit, ""));
              break;
            case 1:
              words.push(handle_tens(digit, price[digitIndex + 1]));
              break;
            case 2:
              words.push(0 != digit ? " " + singleDigit[digit] + " Hundred" + (0 != price[digitIndex + 1] && 0 != price[digitIndex + 2] ? " and" : "") : "");
              break;
            case 3:
              words.push(handle_utlc(digit, nextDigit, "Thousand"));
              break;
            case 4:
              words.push(handle_tens(digit, price[digitIndex + 1]));
              break;
            case 5:
              words.push(handle_utlc(digit, nextDigit, "Lakh"));
              break;
            case 6:
              words.push(handle_tens(digit, price[digitIndex + 1]));
              break;
            case 7:
              words.push(handle_utlc(digit, nextDigit, "Crore"));
              break;
            case 8:
              words.push(handle_tens(digit, price[digitIndex + 1]));
              break;
            case 9:
              words.push(0 != digit ? " " + singleDigit[digit] + " Hundred" + (0 != price[digitIndex + 1] || 0 != price[digitIndex + 2] ? " and" : " Crore") : "")
          }
        rupees = words.reverse().join("")
      } else rupees = "";
      if (rupees)
        rupees = `${rupees} Rupees`
      if (pointer != "00") {
        digitIndex = 0;
        digit = 0;
        nextDigit = 0;
        for (digitIndex = pointer.length - 1; digitIndex >= 0; digitIndex--)
          switch (digit = pointer[digitIndex] - 0, nextDigit = digitIndex > 0 ? pointer[digitIndex - 1] - 0 : 0, pointer.length - digitIndex - 1) {
            case 0:
              paisaWords.push(handle_utlc(digit, nextDigit, ""));
              break;
            case 1:
              paisaWords.push(handle_tens(digit, pointer[digitIndex + 1]));
              break;
          }
        paisa = paisaWords.reverse().join("");
        if (rupees)
          rupees = `${rupees} and ${paisa} Paisa`
        else
          rupees = `${paisa} Paisa`
      }
      return rupees
    }
  }


}

// const isInteger = function(x: any) {
//    return x % 1 === 0;
// }


// const arr = x => Array.from(x);
// const num = x => Number(x) || 0;
// const str = x => String(x);
// const isEmpty = xs => xs.length === 0;
// const take = n => xs => xs.slice(0,n);
// const drop = n => xs => xs.slice(n);
// const reverse = xs => xs.slice(0).reverse();
// const comp = f => g => x => f (g (x));
// const not = x => !x;
// const chunk = n => xs =>
//   isEmpty(xs) ? [] : [take(n)(xs), ...chunk (n) (drop (n) (xs))];
// // numToWords :: (Number a, String a) => a -> String
// let numToWords = n => {
//   let a = [
//     '', 'one', 'two', 'three', 'four',
//     'five', 'six', 'seven', 'eight', 'nine',
//     'ten', 'eleven', 'twelve', 'thirteen', 'fourteen',
//     'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
//   ];
//   let b = [
//     '', '', 'twenty', 'thirty', 'forty',
//     'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
//   ];
//   let g = [
//     '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion',
//     'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion'
//   ];
//   // this part is really nasty still
//   // it might edit this again later to show how Monoids could fix this up
//   let makeGroup = ([ones,tens,huns]) => {
//     return [
//       num(huns) === 0 ? '' : a[huns] + ' hundred ',
//       num(ones) === 0 ? b[tens] : b[tens] && b[tens] + '-' || '',
//       a[tens+ones] || a[ones]
//     ].join('');
//   };
//   // "thousands" constructor; no real good names for this, i guess
//   let thousand = (group,i) => group === '' ? group : `${group} ${g[i]}`;
//   // execute !
//   if (typeof n === 'number') return numToWords(String(n));
//   if (n === '0')             return 'zero';
//   return comp (chunk(3)) (reverse) (arr(n))
//     .map(makeGroup)
//     .map(thousand)
//     .filter(comp(not)(isEmpty))
//     .reverse()
//     .join(' ');
// };