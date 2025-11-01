/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreatePostDto = {
    title: string;
    excerpt: string;
    content: string;
    featuredImage?: string;
    category: CreatePostDto.category;
    tags?: Array<string>;
    commentsEnabled: boolean;
};
export namespace CreatePostDto {
    export enum category {
        TECHNOLOGY = 'technology',
        DESIGN = 'design',
        BUSINESS = 'business',
        MARKETING = 'marketing',
        PROGRAMMING = 'programming',
        TUTORIAL = 'tutorial',
        NEWS = 'news',
        OTHER = 'other',
    }
}

