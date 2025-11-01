/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateContentDto = {
    title: string;
    type: CreateContentDto.type;
    content: string;
    duration: number;
    order: number;
    isFreePreview: boolean;
};
export namespace CreateContentDto {
    export enum type {
        VIDEO = 'video',
        TEXT = 'text',
        QUIZ = 'quiz',
        DOCUMENT = 'document',
    }
}

