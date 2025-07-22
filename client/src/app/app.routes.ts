import { Routes } from '@angular/router';
import { HomePage } from './page/home/home.component';
import { LoginPage } from './page/login/login.component';
import { RegisterPage } from './page/register/register.component';
import { PostPage } from './page/post/post.component';
import { EditorPage } from './page/editor/editor.component';
import { BlogPage } from './page/blog/blog.component';

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
        component: BlogPage,
    },
    {
        path: 'blog/:blogId/post/:postId',
        component: PostPage,
    },
    {
        path: 'blog/:blogId/editor',
        component: EditorPage,
    },
    {
        path: 'blog/:blogId/editor/:id',
        component: EditorPage,
    },
];
