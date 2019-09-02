import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
  name: "initials"
})
export class InitialsPipe implements PipeTransform {

  public transform(value: string): string {
    return value.split(" ").map(x => x[0]).reduce((x, y) => x + y).toUpperCase();
  }

}
