// import bcrypt from 'bcryptjs';

export const isAuthenticated = () => localStorage.getItem('compreAqui@token');
// export const isAdministrator = () => bcrypt.compareSync('#isAdm@', localStorage.getItem('isAdm'));