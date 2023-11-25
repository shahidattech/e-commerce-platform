import * as _ from "lodash";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: "demoPicture",
    pure: true
})
export class DemoPicturePipe implements PipeTransform {
  transform(list: Array<any>): Array<any> {
    let randomNum = Math.floor(Math.random() * list.length);
    return list[randomNum];
  }
}