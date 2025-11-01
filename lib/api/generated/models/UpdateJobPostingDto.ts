/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UpdateJobPostingDto = {
    /**
     * Statut de l'offre
     */
    status?: UpdateJobPostingDto.status;
};
export namespace UpdateJobPostingDto {
    /**
     * Statut de l'offre
     */
    export enum status {
        DRAFT = 'draft',
        OPEN = 'open',
        CLOSED = 'closed',
        ARCHIVED = 'archived',
    }
}

