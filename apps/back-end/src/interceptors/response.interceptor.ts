import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { IApiResponse } from "@cricket-analysis-monorepo/interfaces"

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, IApiResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<IApiResponse<T>> {
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe(map(data => ({ data: data?.data ?? {}, statusCode: response.statusCode, message: data?.message })));
    }
}