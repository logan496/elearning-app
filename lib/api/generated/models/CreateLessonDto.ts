/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateLessonDto = {
    title: string;
    description: string;
    thumbnail?: string;
    price: number;
    isFree: boolean;
    level: CreateLessonDto.level;
    duration: number;
    tags?: Array<string>;
};
export namespace CreateLessonDto {
    export enum level {
        BEGINNER = 'beginner',
        INTERMEDIATE = 'intermediate',
        ADVANCED = 'advanced',
    }
}

