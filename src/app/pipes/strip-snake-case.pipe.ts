import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
  name: "stripsnakecase"
})
export class StripSnakeCasePipe implements PipeTransform {

  public transform(value: string): string {
    return value.replace("_", " ");
  }

}
