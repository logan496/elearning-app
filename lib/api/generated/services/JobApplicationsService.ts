/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateApplicationDto } from '../models/CreateApplicationDto';
import type { CreateJobPostingDto } from '../models/CreateJobPostingDto';
import type { UpdateApplicationStatusDto } from '../models/UpdateApplicationStatusDto';
import type { UpdateJobPostingDto } from '../models/UpdateJobPostingDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class JobApplicationsService {
    /**
     * Obtenir toutes les offres ouvertes
     * @param page
     * @param limit
     * @param jobType
     * @param location
     * @param isRemote
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerGetAllJobPostings(
        page?: number,
        limit?: number,
        jobType?: string,
        location?: string,
        isRemote?: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs',
            query: {
                'page': page,
                'limit': limit,
                'jobType': jobType,
                'location': location,
                'isRemote': isRemote,
            },
        });
    }
    /**
     * Créer une offre d'emploi
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerCreateJobPosting(
        requestBody: CreateJobPostingDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/jobs',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Rechercher des offres
     * @param q
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerSearchJobs(
        q: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs/search',
            query: {
                'q': q,
            },
        });
    }
    /**
     * Obtenir une offre par slug
     * @param slug
     * @param userId
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerGetJobBySlug(
        slug: string,
        userId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs/{slug}',
            path: {
                'slug': slug,
            },
            query: {
                'userId': userId,
            },
        });
    }
    /**
     * Obtenir mes offres postées
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerGetMyJobPostings(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs/my/postings',
        });
    }
    /**
     * Mettre à jour une offre
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerUpdateJobPosting(
        id: number,
        requestBody: UpdateJobPostingDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/jobs/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Supprimer une offre
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerDeleteJobPosting(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/jobs/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Publier une offre
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerPublishJobPosting(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/jobs/{id}/publish',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Fermer une offre
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerCloseJobPosting(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/jobs/{id}/close',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Postuler à une offre
     * @param jobId
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerApplyToJob(
        jobId: number,
        requestBody: CreateApplicationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/jobs/{jobId}/apply',
            path: {
                'jobId': jobId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Obtenir mes candidatures
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerGetMyApplications(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs/my/applications',
        });
    }
    /**
     * Obtenir les candidatures d'une offre (recruteur)
     * @param jobId
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerGetJobApplications(
        jobId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs/{jobId}/applications',
            path: {
                'jobId': jobId,
            },
        });
    }
    /**
     * Mettre à jour le statut d'une candidature (recruteur)
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerUpdateApplicationStatus(
        id: number,
        requestBody: UpdateApplicationStatusDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/jobs/applications/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Retirer sa candidature
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerWithdrawApplication(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/jobs/applications/{id}/withdraw',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Obtenir les statistiques d'une offre (recruteur)
     * @param jobId
     * @returns any
     * @throws ApiError
     */
    public static applicationsControllerGetJobStatistics(
        jobId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/jobs/{jobId}/statistics',
            path: {
                'jobId': jobId,
            },
        });
    }
}
