/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type EnrollLessonDto = {
    lessonId: number;
    paymentMethod: EnrollLessonDto.paymentMethod;
};
export namespace EnrollLessonDto {
    export enum paymentMethod {
        STRIPE = 'stripe',
        PAYPAL = 'paypal',
        MOBILE_MONEY = 'mobile_money',
        BANK_TRANSFER = 'bank_transfer',
    }
}

