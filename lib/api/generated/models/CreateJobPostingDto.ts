/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateJobPostingDto = {
    title: string;
    description: string;
    requirements: string;
    responsibilities?: string;
    benefits?: string;
    company: string;
    companyLogo?: string;
    location: string;
    isRemote: boolean;
    jobType: CreateJobPostingDto.jobType;
    experienceLevel: CreateJobPostingDto.experienceLevel;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    skills?: Array<string>;
    deadline?: string;
    /**
     * Statut de l'offre (par défaut: OPEN)
     */
    status?: CreateJobPostingDto.status;
};
export namespace CreateJobPostingDto {
    export enum jobType {
        FULL_TIME = 'full_time',
        PART_TIME = 'part_time',
        CONTRACT = 'contract',
        INTERNSHIP = 'internship',
        FREELANCE = 'freelance',
    }
    export enum experienceLevel {
        ENTRY = 'entry',
        JUNIOR = 'junior',
        MID = 'mid',
        SENIOR = 'senior',
        LEAD = 'lead',
    }
    /**
     * Statut de l'offre (par défaut: OPEN)
     */
    export enum status {
        DRAFT = 'draft',
        OPEN = 'open',
        CLOSED = 'closed',
        ARCHIVED = 'archived',
    }
}

