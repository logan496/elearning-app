/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApproveApplicationDto } from '../models/ApproveApplicationDto';
import type { UpdatePublisherStatusDto } from '../models/UpdatePublisherStatusDto';
import type { UpdateUserRoleDto } from '../models/UpdateUserRoleDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminService {
    /**
     * Obtenir les statistiques du dashboard
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetDashboardStats(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/dashboard',
        });
    }
    /**
     * Obtenir tous les utilisateurs
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetAllUsers(
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/users',
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * Obtenir un utilisateur par ID
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetUserById(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Supprimer un utilisateur
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static adminControllerDeleteUser(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Promouvoir/Rétrograder un utilisateur admin
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static adminControllerMakeUserAdmin(
        id: number,
        requestBody: UpdateUserRoleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/users/{id}/admin',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Activer/Désactiver le statut publisher
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static adminControllerUpdatePublisherStatus(
        id: number,
        requestBody: UpdatePublisherStatusDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/users/{id}/publisher',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Obtenir toutes les candidatures
     * @param page
     * @param limit
     * @param status
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetAllApplications(
        page?: number,
        limit?: number,
        status?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/applications',
            query: {
                'page': page,
                'limit': limit,
                'status': status,
            },
        });
    }
    /**
     * Approuver/Modifier le statut d'une candidature
     * @param id
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static adminControllerApproveApplication(
        id: number,
        requestBody: ApproveApplicationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/applications/{id}/approve',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Obtenir toutes les leçons
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetAllLessons(
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/lessons',
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * Supprimer une leçon
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static adminControllerDeleteLesson(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/lessons/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Obtenir tous les articles de blog
     * @param page
     * @param limit
     * @returns any
     * @throws ApiError
     */
    public static adminControllerGetAllBlogPosts(
        page?: number,
        limit?: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/blog-posts',
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * Supprimer un article de blog
     * @param id
     * @returns any
     * @throws ApiError
     */
    public static adminControllerDeleteBlogPost(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/blog-posts/{id}',
            path: {
                'id': id,
            },
        });
    }
}
