export interface Employee {
    email: string;
    fullName: string;
    currentReporters: Role[];
    designatedReporters: Role[]
    role: Role;
    isReported: boolean;
}

export enum Role {
    DEFAULT = '',
    ROOT = 'Root',
    ADMIN = 'Admin',
    MANAGER = 'Manager',
    CALLER = 'Caller'
}

export enum Header {
    EMAIL = 'Email',
    NAME = 'FullName',
    ROLE = 'Role',
    REPORTSTO = 'ReportsTo'
}