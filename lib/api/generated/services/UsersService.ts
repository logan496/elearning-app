/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateUserDto } from '../models/UpdateUserDto';
import type { UserResponseDto } from '../models/UserResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Récupérer tous les utilisateurs
     * @returns UserResponseDto Liste des utilisateurs
     * @throws ApiError
     */
    public static usersControllerGetAllUsers(): CancelablePromise<Array<UserResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users',
        });
    }
    /**
     * Récupérer un utilisateur par son ID
     * @param id ID de l'utilisateur
     * @returns UserResponseDto Détails de l'utilisateur
     * @throws ApiError
     */
    public static usersControllerGetUserById(
        id: number,
    ): CancelablePromise<UserResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Utilisateur non trouvé`,
            },
        });
    }
    /**
     * Mettre à jour un utilisateur
     * @param id ID de l'utilisateur
     * @param requestBody
     * @returns UserResponseDto Utilisateur mis à jour
     * @throws ApiError
     */
    public static usersControllerUpdateUser(
        id: number,
        requestBody: UpdateUserDto,
    ): CancelablePromise<UserResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Utilisateur non trouvé`,
            },
        });
    }
    /**
     * Supprimer un utilisateur
     * @param id ID de l'utilisateur
     * @returns any Utilisateur supprimé
     * @throws ApiError
     */
    public static usersControllerDeleteUser(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Utilisateur non trouvé`,
            },
        });
    }
    /**
     * Promouvoir un utilisateur en publisher
     * @param id ID de l'utilisateur
     * @returns UserResponseDto Utilisateur promu en publisher
     * @throws ApiError
     */
    public static usersControllerMakePublisher(
        id: number,
    ): CancelablePromise<UserResponseDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/users/{id}/make-publisher',
            path: {
                'id': id,
            },
            errors: {
                404: `Utilisateur non trouvé`,
            },
        });
    }
}
