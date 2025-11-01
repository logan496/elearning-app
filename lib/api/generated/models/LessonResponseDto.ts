/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InstructorDto } from './InstructorDto';
export type LessonResponseDto = {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    isFree: boolean;
    level: LessonResponseDto.level;
    status: LessonResponseDto.status;
    duration: number;
    tags: Array<string>;
    enrollmentCount: number;
    instructor: InstructorDto;
    createdAt: string;
    isEnrolled: boolean;
    progress: number;
};
export namespace LessonResponseDto {
    export enum level {
        BEGINNER = 'beginner',
        INTERMEDIATE = 'intermediate',
        ADVANCED = 'advanced',
    }
    export enum status {
        DRAFT = 'draft',
        PUBLISHED = 'published',
        ARCHIVED = 'archived',
    }
}

