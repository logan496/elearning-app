/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatePodcastDto } from '../models/CreatePodcastDto';
import type { PodcastResponseDto } from '../models/PodcastResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PodcastsService {
    /**
     * Créer un nouveau podcast (publishers uniquement)
     * @param requestBody
     * @returns PodcastResponseDto Podcast créé
     * @throws ApiError
     */
    public static podcastControllerCreatePodcast(
        requestBody: CreatePodcastDto,
    ): CancelablePromise<PodcastResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/podcasts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Vous ne pouvez pas publier de podcasts`,
            },
        });
    }
    /**
     * Récupérer tous les podcasts
     * @returns PodcastResponseDto Liste des podcasts
     * @throws ApiError
     */
    public static podcastControllerGetAllPodcasts(): CancelablePromise<Array<PodcastResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/podcasts',
        });
    }
    /**
     * Récupérer un podcast par son ID
     * @param id ID du podcast
     * @returns PodcastResponseDto Détails du podcast
     * @throws ApiError
     */
    public static podcastControllerGetPodcastById(
        id: number,
    ): CancelablePromise<PodcastResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/podcasts/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Podcast non trouvé`,
            },
        });
    }
    /**
     * Supprimer un podcast
     * @param id ID du podcast
     * @returns any Podcast supprimé
     * @throws ApiError
     */
    public static podcastControllerDeletePodcast(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/podcasts/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Vous ne pouvez pas supprimer ce podcast`,
                404: `Podcast non trouvé`,
            },
        });
    }
    /**
     * Récupérer les podcasts d'un publisher
     * @param publisherId ID du publisher
     * @returns PodcastResponseDto Liste des podcasts du publisher
     * @throws ApiError
     */
    public static podcastControllerGetPodcastsByPublisher(
        publisherId: number,
    ): CancelablePromise<Array<PodcastResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/podcasts/publisher/{publisherId}',
            path: {
                'publisherId': publisherId,
            },
        });
    }
}
