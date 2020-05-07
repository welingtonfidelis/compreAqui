import bcrypt from 'bcryptjs';

export const isAuthenticated = () => localStorage.getItem('compreAqui@token');
export const isComercial = () => bcrypt.compareSync('comercial', localStorage.getItem('compreAqui@typeUser'));