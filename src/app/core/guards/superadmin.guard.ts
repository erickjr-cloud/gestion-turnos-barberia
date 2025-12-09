import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const superAdminGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUserRole$.pipe(
    take(1),
    map(rol => {
      if (rol === 'superadmin') {
        return true;
      } else {
        router.navigate(['/auth']);
        return false;
      }
    })
  );
};
