import { Routes } from '@angular/router';
import { HomePage } from './page/home/home';
import { LoginPage } from './page/login/login';
import { RegisterPage } from './page/register/register';
import { PostPage } from './page/post/post';
import { EditorPage } from './page/editor/editor';

export const routes: Routes = [
    {
        path: '',
        component: HomePage,
    },
    {
        path: 'login',
        component: LoginPage,
    },
    {
        path: 'register',
        component: RegisterPage,
    },
    {
        path: 'blog/:id',
        component: PostPage,
    },
    {
        path: 'blog/:blogId/post/:postId',
        component: PostPage,
    },
    {
        path: 'editor',
        component: EditorPage,
    },
];
