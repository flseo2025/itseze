export declare const userFixtures: {
    validUser: {
        id: string;
        name: string;
        email: string;
        password: string;
        role: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    };
    adminUser: {
        id: string;
        name: string;
        email: string;
        password: string;
        role: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    };
    inactiveUser: {
        id: string;
        name: string;
        email: string;
        password: string;
        role: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    };
};
export declare const authFixtures: {
    validCredentials: {
        email: string;
        password: string;
    };
    invalidCredentials: {
        email: string;
        password: string;
    };
    jwtToken: string;
    refreshToken: string;
    expiredToken: string;
};
export declare const apiFixtures: {
    successResponse: {
        success: boolean;
        data: {
            id: string;
            message: string;
        };
        timestamp: string;
    };
    errorResponse: {
        success: boolean;
        error: {
            code: string;
            message: string;
            details: string[];
        };
        timestamp: string;
    };
    notFoundResponse: {
        success: boolean;
        error: {
            code: string;
            message: string;
            details: never[];
        };
        timestamp: string;
    };
    unauthorizedResponse: {
        success: boolean;
        error: {
            code: string;
            message: string;
            details: never[];
        };
        timestamp: string;
    };
};
export declare const dbFixtures: {
    users: {
        id: string;
        name: string;
        email: string;
        password: string;
        role: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    }[];
    posts: {
        id: string;
        title: string;
        content: string;
        authorId: string;
        published: boolean;
        tags: string[];
        createdAt: string;
        updatedAt: string;
    }[];
    comments: {
        id: string;
        content: string;
        authorId: string;
        postId: string;
        createdAt: string;
        updatedAt: string;
    }[];
};
export declare const validationFixtures: {
    validEmails: string[];
    invalidEmails: string[];
    validPasswords: string[];
    invalidPasswords: string[];
    validUuids: string[];
    invalidUuids: string[];
};
export declare const httpFixtures: {
    headers: {
        json: {
            'Content-Type': string;
            Accept: string;
        };
        authenticated: (token: string) => {
            'Content-Type': string;
            Accept: string;
            Authorization: string;
        };
        formData: {
            'Content-Type': string;
        };
    };
    requests: {
        createUser: {
            method: string;
            url: string;
            body: {
                name: string;
                email: string;
                password: string;
            };
        };
        loginUser: {
            method: string;
            url: string;
            body: {
                email: string;
                password: string;
            };
        };
        updateUser: {
            method: string;
            url: string;
            body: {
                name: string;
                email: string;
            };
        };
    };
};
export declare const envFixtures: {
    test: {
        NODE_ENV: string;
        DATABASE_URL: string;
        JWT_SECRET: string;
        JWT_EXPIRES_IN: string;
        BCRYPT_ROUNDS: string;
        API_BASE_URL: string;
    };
    production: {
        NODE_ENV: string;
        DATABASE_URL: string;
        JWT_SECRET: string;
        JWT_EXPIRES_IN: string;
        BCRYPT_ROUNDS: string;
        API_BASE_URL: string;
    };
};
export declare const errorFixtures: {
    validationError: {
        name: string;
        message: string;
        details: {
            field: string;
            message: string;
        }[];
    };
    notFoundError: {
        name: string;
        message: string;
        statusCode: number;
    };
    unauthorizedError: {
        name: string;
        message: string;
        statusCode: number;
    };
    forbiddenError: {
        name: string;
        message: string;
        statusCode: number;
    };
    internalServerError: {
        name: string;
        message: string;
        statusCode: number;
    };
};
//# sourceMappingURL=test-data.d.ts.map