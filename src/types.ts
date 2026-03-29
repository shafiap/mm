export type Role = 'Faculty' | 'Admin';

export interface Personnel {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  department: string;
  initials: string;
  bgColor: string;
}

export interface Stats {
  totalUsers: number;
  activeFaculty: number;
  pendingInvites: number;
}
