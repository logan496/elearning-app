/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateContentDto } from '../models/CreateContentDto';
import type { CreateLessonDto } from '../models/CreateLessonDto';
import type { CreateModuleDto } from '../models/CreateModuleDto';
import type { EnrollLessonDto } from '../models/EnrollLessonDto';
import type { LessonResponseDto } from '../models/LessonResponseDto';
import type { UpdateLessonDto } from '../models/UpdateLessonDto';
import type { UpdateProgressDto } from '../models/UpdateProgressDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LessonsService {
    /**
     * Obtenir toutes les leçons publiées
     * @param userId
     * @returns LessonResponseDto Liste des leçons
     * @throws ApiError
     */
    public static lessonsControllerGetAllLessons(
        userId: number,
    ): CancelablePromise<Array<LessonResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/lessons',
            query: {
                'userId': userId,
            },
        });
    }
    /**
     * Créer une nouvelle leçon (instructeur)
     * @param requestBody
     * @returns any Leçon créée
     * @throws ApiError
     */
    public static lessonsControllerCreateLesson(
        requestBody: CreateLessonDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/lessons',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Obtenir toutes les leçons
     * @returns LessonResponseDto Liste des leçons disponibles
     * @throws ApiError
     */
    public static lessonsControllerGetAllPublishedLessons(): CancelablePromise<Array<LessonResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/lessons/published',
        });
    }
    /**
     * Obtenir une leçon par ID
     * @param id ID de la leçon
     * @param userId
     * @returns LessonResponseDto Détails de la leçon
     * @throws ApiError
     */
    public static lessonsControllerGetLessonById(
        id: number,
        userId: number,
    ): CancelablePromise<LessonResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/lessons/{id}',
            path: {
                'id': id,
            },
            query: {
                'userId': userId,
            },
        });
    }
    /**
     * Mettre à jour une leçon
     * @param id ID de la leçon
     * @param requestBody
     * @returns any Leçon mise à jour
     * @throws ApiError
     */
    public static lessonsControllerUpdateLesson(
        id: number,
        requestBody: UpdateLessonDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/lessons/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Supprimer une leçon
     * @param id ID de la leçon
     * @returns any Leçon supprimée
     * @throws ApiError
     */
    public static lessonsControllerDeleteLesson(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/lessons/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Obtenir mes leçons créées
     * @returns any Liste des leçons créées
     * @throws ApiError
     */
    public static lessonsControllerGetMyLessons(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/lessons/my/created',
        });
    }
    /**
     * Publier une leçon
     * @param id ID de la leçon
     * @returns any Leçon publiée
     * @throws ApiError
     */
    public static lessonsControllerPublishLesson(
        id: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/lessons/{id}/publish',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Ajouter un module à une leçon
     * @param lessonId ID de la leçon
     * @param requestBody
     * @returns any Module créé
     * @throws ApiError
     */
    public static lessonsControllerCreateModule(
        lessonId: number,
        requestBody: CreateModuleDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/lessons/{lessonId}/modules',
            path: {
                'lessonId': lessonId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Ajouter du contenu à un module
     * @param moduleId ID du module
     * @param requestBody
     * @returns any Contenu créé
     * @throws ApiError
     */
    public static lessonsControllerCreateContent(
        moduleId: number,
        requestBody: CreateContentDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/lessons/modules/{moduleId}/contents',
            path: {
                'moduleId': moduleId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Obtenir un contenu spécifique
     * @param contentId ID du contenu
     * @returns any Contenu
     * @throws ApiError
     */
    public static lessonsControllerGetContent(
        contentId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/lessons/contents/{contentId}',
            path: {
                'contentId': contentId,
            },
        });
    }
    /**
     * S'inscrire à une leçon
     * @param requestBody
     * @returns any Inscription réussie
     * @throws ApiError
     */
    public static lessonsControllerEnrollLesson(
        requestBody: EnrollLessonDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/lessons/enroll',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Obtenir mes inscriptions
     * @returns any Liste des inscriptions
     * @throws ApiError
     */
    public static lessonsControllerGetMyEnrollments(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/lessons/my/enrollments',
        });
    }
    /**
     * Mettre à jour la progression
     * @param requestBody
     * @returns any Progression mise à jour
     * @throws ApiError
     */
    public static lessonsControllerUpdateProgress(
        requestBody: UpdateProgressDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/lessons/progress',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Obtenir la progression dans une leçon
     * @param lessonId ID de la leçon
     * @returns any Progression
     * @throws ApiError
     */
    public static lessonsControllerGetLessonProgress(
        lessonId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/lessons/{lessonId}/progress',
            path: {
                'lessonId': lessonId,
            },
        });
    }
}
