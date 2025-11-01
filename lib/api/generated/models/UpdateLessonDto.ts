/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateLessonDto = {
    title?: string;
    description?: string;
    thumbnail?: string;
    price?: number;
    isFree?: boolean;
    level?: UpdateLessonDto.level;
    duration?: number;
    tags?: Array<string>;
};
export namespace UpdateLessonDto {
    export enum level {
        BEGINNER = 'beginner',
        INTERMEDIATE = 'intermediate',
        ADVANCED = 'advanced',
    }
}

