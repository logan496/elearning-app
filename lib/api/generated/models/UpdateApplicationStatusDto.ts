/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateApplicationStatusDto = {
    status: UpdateApplicationStatusDto.status;
    notes?: string;
    feedback?: string;
};
export namespace UpdateApplicationStatusDto {
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

