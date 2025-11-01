/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ApproveApplicationDto = {
    status: ApproveApplicationDto.status;
    feedback?: string;
};
export namespace ApproveApplicationDto {
    export enum status {
        PENDING = 'pending',
        REVIEWING = 'reviewing',
        SHORTLISTED = 'shortlisted',
        INTERVIEW = 'interview',
        ACCEPTED = 'accepted',
        REJECTED = 'rejected',
        WITHDRAWN = 'withdrawn',
    }
}

