// import React from 'react';
// import { useSelector } from 'react-redux';
// import { Outlet, Navigate } from 'react-router-dom';
//
// export const ProtectedRoute = ({ accessRoles }: { accessRoles: Role[] }) => {
//   const { isInit, isLoading, user } = useSelector(
//     (store: RootState) => store.user
//   );
//
//   if (!isInit || isLoading) {
//     return <div>Загрузка</div>;
//   }
//
//   if (!user || !accessRoles.some((role) => role === user.role)) {
//     return <Navigate replace to='/sign-in' />;
//   }
//
//   return <Outlet />;
// };
