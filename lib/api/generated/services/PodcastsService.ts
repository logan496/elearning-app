/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PodcastsService {
    /**
     * Obtenir tous les podcasts publiés
     * @param page
     * @param limit
     * @param type audio ou video
     * @param category
     * @returns any
     * @throws ApiError
     */
    public static podcastControllerGetAllPodcasts(
        page?: number,
        limit?: number,
        type?: string,
        category?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/podcasts',
            query: {
                'page': page,
                'limit': limit,
                'type': type,
                'category': category,
            },
        });
    }
    /**
     * Créer un podcast avec upload de fichiers
     * @param formData
     * @returns any
     * @throws ApiError
     */
    public static podcastControllerCreatePodcast(
        formData: {
            title: string;
            description: string;
            type: 'audio' | 'video';
            duration: number;
            category?: string;
            /**
             * Séparés par des virgules
             */
            tags?: string;
            autoShareOnPublish?: boolean;
            /**
             * Fichier audio (max 20MB) ou vidéo (max 50MB)
             */
            mediaFile: Blob;
            /**
             * Image miniature (optionnel, max 5MB)
             */
            thumbnailFile?: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/podcasts',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Rechercher des podcasts
     * @param q
     * @returns any
     * @throws ApiError
     */
    public static podcastControllerSearchPodcasts(
        q: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/podcasts/search',
            query: {
                'q': q,
            },
        });
    }
    /**
     * Obtenir mes podcasts
     * @returns any
     * @throws ApiError
     */
    public static podcastControllerGetMyPodcasts(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/podcasts/my-podcasts',
        });
    }
    /**
     * Obtenir un podcast par ID
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static podcastControllerGetPodcastById(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/podcasts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Mettre à jour un podcast
     * @param id
     * @param formData
     * @returns any
     * @throws ApiError
     */
    public static podcastControllerUpdatePodcast(
        id: number,
        formData: {
            title?: string;
            description?: string;
            type?: 'audio' | 'video';
            duration?: number;
            category?: string;
            /**
             * Séparés par des virgules
             */
            tags?: string;
            autoShareOnPublish?: boolean;
            mediaFile?: Blob;
            thumbnailFile?: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/podcasts/{id}',
            path: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Supprimer un podcast
     * @param id
     * @returns any
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
        });
    }
    /**
     * Publier un podcast
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static podcastControllerPublishPodcast(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/podcasts/{id}/publish',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Liker/Unliker un podcast
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static podcastControllerToggleLike(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/podcasts/{id}/like',
            path: {
                'id': id,
            },
        });
    }
}
