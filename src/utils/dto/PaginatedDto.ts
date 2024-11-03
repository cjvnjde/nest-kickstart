import { ApiProperty } from "@nestjs/swagger";
import { PartialDeep } from "../../types/PartialDeep";

export class PaginatedDto<T> {
  @ApiProperty({ isArray: true })
  results: T[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  pageCount: number;

  @ApiProperty()
  currentPage: number;

  constructor(partial: PartialDeep<PaginatedDto<T>>, ResultClass: new (partial: PartialDeep<T>) => T) {
    this.results = partial.results.map((item) => new ResultClass(item));
    this.total = partial.total || 0;
    this.pageCount = partial.pageCount || 0;
    this.currentPage = partial.currentPage || 0;
  }
}
